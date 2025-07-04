use std::collections::HashMap;
use std::fs::{self, File, OpenOptions};
use std::io::Write;
use std::path::{Path, PathBuf};

use crate::commands::push::sha256_file;
use crate::config;

pub fn run(_args: &[String]) {
    if let Err(e) = pull_all() {
        eprintln!("{e}");
    }
}

pub fn pull_all() -> std::io::Result<()> {
    let remote = config::primary_remote();
    fs::create_dir_all(".haven/objects")?;
    fs::create_dir_all(".haven/metadata")?;
    let mut log = OpenOptions::new()
        .create(true)
        .append(true)
        .open(".haven/pull.log")?;

    pull_objects(&remote, &mut log)?;
    pull_metadata(&remote, &mut log)
}

fn pull_objects(remote: &Path, log: &mut File) -> std::io::Result<()> {
    let mut chunks: HashMap<String, Vec<PathBuf>> = HashMap::new();
    let obj_dir = remote.join("objects");
    if !obj_dir.exists() {
        return Ok(());
    }
    for entry in fs::read_dir(&obj_dir)? {
        let entry = entry?;
        let name = entry.file_name();
        let name = name.to_string_lossy();
        if let Some((base, _)) = name.split_once(".part") {
            chunks
                .entry(base.to_string())
                .or_default()
                .push(entry.path());
        } else {
            pull_object(&name, remote, log)?;
        }
    }
    for (base, mut parts) in chunks {
        parts.sort();
        assemble_object(&base, &parts, log)?;
    }
    Ok(())
}

pub fn pull_object(name: &str, remote: &Path, log: &mut File) -> std::io::Result<()> {
    let local = Path::new(".haven/objects").join(name);
    if local.exists() {
        return Ok(());
    }
    let remote_file = remote.join("objects").join(name);
    if remote_file.exists() {
        fs::copy(&remote_file, &local)?;
        writeln!(log, "object {}", name)?;
        return Ok(());
    }
    let mut parts = Vec::new();
    for i in 0.. {
        let part = remote_file.with_extension(format!("part{}", i));
        if part.exists() {
            parts.push(part);
        } else {
            break;
        }
    }
    if !parts.is_empty() {
        assemble_object(name, &parts, log)?;
    }
    Ok(())
}

fn assemble_object(name: &str, parts: &[PathBuf], log: &mut File) -> std::io::Result<()> {
    let local = Path::new(".haven/objects").join(name);
    if local.exists() {
        return Ok(());
    }
    let mut out = File::create(&local)?;
    for p in parts {
        let data = fs::read(p)?;
        out.write_all(&data)?;
    }
    let hash = sha256_file(&local)?;
    if hash == name {
        writeln!(log, "object {}", name)?;
    } else {
        fs::remove_file(&local)?;
        eprintln!("Hash mismatch for {}", name);
    }
    Ok(())
}

fn pull_metadata(remote: &Path, log: &mut File) -> std::io::Result<()> {
    let meta_dir = remote.join("metadata");
    if !meta_dir.exists() {
        return Ok(());
    }
    for entry in fs::read_dir(meta_dir)? {
        let entry = entry?;
        let dest = Path::new(".haven/metadata").join(entry.file_name());
        if !dest.exists() {
            fs::copy(entry.path(), &dest)?;
            writeln!(log, "snapshot {}", dest.display())?;
        }
    }
    Ok(())
}
