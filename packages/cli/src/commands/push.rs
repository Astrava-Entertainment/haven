use sha2::{Digest, Sha256};
use std::fs::{self, File, OpenOptions};
use std::io::{Read, Write};
use std::path::{Path, PathBuf};

use crate::config;
use crate::{plugins, webhooks};

pub fn run(_args: &[String]) {
    match push_all() {
        Ok(_) => {
            let payload = format!(
                "{{\"event\":\"push\",\"user\":\"{}\",\"timestamp\":\"{}\"}}",
                std::env::var("USER").unwrap_or_default(),
                chrono::Utc::now().to_rfc3339()
            );
            plugins::trigger("onPush", &payload);
            webhooks::dispatch("push", &payload);
        }
        Err(e) => eprintln!("{e}"),
    }
}

pub fn push_all() -> std::io::Result<()> {
    let remotes = config::remote_paths();
    let mut ok = false;
    for remote in remotes {
        if let Err(e) = push_to_remote(&remote) {
            eprintln!("Error al enviar a {}: {e}", remote.display());
        } else {
            ok = true;
        }
    }
    if ok { Ok(()) } else { Err(std::io::Error::new(std::io::ErrorKind::Other, "sin buckets disponibles")) }
}

fn push_to_remote(remote: &Path) -> std::io::Result<()> {
    fs::create_dir_all(remote.join("objects"))?;
    fs::create_dir_all(remote.join("metadata"))?;
    let mut log = OpenOptions::new()
        .create(true)
        .append(true)
        .open(".haven/push.log")?;

    if Path::new(".haven/objects").exists() {
        for entry in fs::read_dir(".haven/objects")? {
            let entry = entry?;
            if entry.file_type()?.is_file() {
                push_object(entry.path(), remote, &mut log)?;
            }
        }
    }

    if Path::new(".haven/metadata").exists() {
        for entry in fs::read_dir(".haven/metadata")? {
            let entry = entry?;
            if entry.file_type()?.is_file() {
                let dest = remote.join("metadata").join(entry.file_name());
                if !dest.exists() {
                    fs::copy(entry.path(), &dest)?;
                    writeln!(log, "snapshot {}", dest.display())?;
                }
            }
        }
    }
    Ok(())
}

pub fn push_object(path: PathBuf, remote_root: &Path, log: &mut File) -> std::io::Result<()> {
    let name = path
        .file_name()
        .map(|n| n.to_string_lossy().to_string())
        .unwrap_or_default();
    if name.is_empty() {
        return Ok(());
    }
    let remote_file = remote_root.join("objects").join(&name);
    if remote_file.exists() || remote_file.with_extension("part0").exists() {
        return Ok(());
    }

    let size = fs::metadata(&path)?.len() as usize;
    let chunk = config::chunk_size();
    if size > chunk {
        let mut f = File::open(&path)?;
        let mut buf = vec![0u8; chunk];
        let mut index = 0;
        loop {
            let n = f.read(&mut buf)?;
            if n == 0 {
                break;
            }
            let chunk_path = remote_file.with_extension(format!("part{}", index));
            if !chunk_path.exists() {
                let mut out = File::create(&chunk_path)?;
                out.write_all(&buf[..n])?;
            }
            index += 1;
        }
    } else {
        fs::copy(&path, &remote_file)?;
    }
    writeln!(log, "object {name}")?;
    Ok(())
}

pub fn remote_bucket() -> PathBuf {
    config::primary_remote()
}

pub fn sha256_file(path: &Path) -> std::io::Result<String> {
    let mut f = File::open(path)?;
    let mut hasher = Sha256::new();
    let mut buf = [0u8; 8192];
    loop {
        let n = f.read(&mut buf)?;
        if n == 0 {
            break;
        }
        hasher.update(&buf[..n]);
    }
    Ok(format!("{:x}", hasher.finalize()))
}
