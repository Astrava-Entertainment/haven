use std::collections::HashSet;
use std::fs::{self, File, OpenOptions};
use std::io::Write;
use std::path::Path;

use crate::commands::{pull, push, p2p};
use crate::config;
use crate::{plugins, webhooks};

pub fn run(_args: &[String]) {
    match sync() {
        Ok(_) => {
            let payload = format!(
                "{{\"event\":\"sync\",\"user\":\"{}\",\"timestamp\":\"{}\"}}",
                std::env::var("USER").unwrap_or_default(),
                chrono::Utc::now().to_rfc3339()
            );
            plugins::trigger("onSync", &payload);
            webhooks::dispatch("sync", &payload);
        }
        Err(e) => eprintln!("{e}"),
    }
}

fn sync() -> std::io::Result<()> {
    let remote = config::primary_remote();
    fs::create_dir_all(remote.join("objects"))?;
    fs::create_dir_all(remote.join("metadata"))?;
    let mut log = OpenOptions::new()
        .create(true)
        .append(true)
        .open(".haven/sync.log")?;

    let local_hashes = list_hashes(Path::new(".haven/objects"))?;
    let remote_hashes = list_hashes(&remote.join("objects"))?;

    for hash in local_hashes.difference(&remote_hashes) {
        let path = Path::new(".haven/objects").join(hash);
        push::push_object(path, &remote, &mut log)?;
    }

    for hash in remote_hashes.difference(&local_hashes) {
        pull::pull_object(hash, &remote, &mut log)?;
    }

    push_metadata(&remote, &mut log)?;
    pull_metadata_missing(&remote, &mut log)?;
    // Trigger P2P synchronization using the iroh based module.
    if let Err(e) = p2p::sync_with_peers(&mut log) {
        eprintln!("p2p sync error: {e}");
    }
    Ok(())
}

fn list_hashes(dir: &Path) -> std::io::Result<HashSet<String>> {
    let mut set = HashSet::new();
    if !dir.exists() {
        return Ok(set);
    }
    for entry in fs::read_dir(dir)? {
        let entry = entry?;
        let name = entry.file_name();
        let fname = name.to_string_lossy();
        if let Some((base, _)) = fname.split_once(".part") {
            set.insert(base.to_string());
        } else {
            set.insert(fname.to_string());
        }
    }
    Ok(set)
}

fn push_metadata(remote: &Path, log: &mut File) -> std::io::Result<()> {
    if !Path::new(".haven/metadata").exists() {
        return Ok(());
    }
    for entry in fs::read_dir(".haven/metadata")? {
        let entry = entry?;
        let dest = remote.join("metadata").join(entry.file_name());
        if !dest.exists() {
            fs::copy(entry.path(), &dest)?;
            writeln!(log, "snapshot {}", dest.display())?;
        }
    }
    Ok(())
}

fn pull_metadata_missing(remote: &Path, log: &mut File) -> std::io::Result<()> {
    let dir = remote.join("metadata");
    if !dir.exists() {
        return Ok(());
    }
    for entry in fs::read_dir(dir)? {
        let entry = entry?;
        let dest = Path::new(".haven/metadata").join(entry.file_name());
        if !dest.exists() {
            fs::copy(entry.path(), &dest)?;
            writeln!(log, "snapshot {}", dest.display())?;
        }
    }
    Ok(())
}
