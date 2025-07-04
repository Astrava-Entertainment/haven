use std::fs::{self, File};
use std::io::{self};
use std::path::{Path, PathBuf};

use crate::commands::{pull};
use crate::commands::push::sha256_file;
use crate::utils;

use crate::config;

#[cfg(unix)]
use std::os::unix::fs as unix_fs;

pub fn run(_args: &[String]) {
    if let Err(e) = mount_latest() {
        eprintln!("{e}");
    }
}

fn mount_latest() -> io::Result<()> {
    let snap = latest_snapshot()?;
    let entries = utils::parse_snapshot(&snap)?;
    for (rel, hash) in entries {
        mount_file(&rel, &hash)?;
    }
    println!("Proyecto montado en .haven/mount");
    Ok(())
}

fn latest_snapshot() -> io::Result<PathBuf> {
    let dir = Path::new(".haven/metadata");
    let mut entries: Vec<_> = fs::read_dir(dir)?
        .filter_map(|e| e.ok())
        .collect();
    entries.sort_by_key(|e| e.file_name());
    if let Some(entry) = entries.pop() {
        Ok(entry.path())
    } else {
        Err(io::Error::new(io::ErrorKind::NotFound, "No hay snapshots"))
    }
}

fn mount_file(rel: &str, hash: &str) -> io::Result<()> {
    let obj = Path::new(".haven/objects").join(hash);
    if !obj.exists() {
        let remote = config::primary_remote();
        let mut log = File::create(".haven/mount.log")?;
        pull::pull_object(hash, &remote, &mut log)?;
    }
    if obj.exists() {
        let mount_path = Path::new(".haven/mount").join(rel);
        if let Some(parent) = mount_path.parent() {
            fs::create_dir_all(parent)?;
        }
        if mount_path.exists() {
            fs::remove_file(&mount_path)?;
        }
        create_symlink(&obj, &mount_path)?;
        verify_integrity(&obj, hash)?;
    }
    Ok(())
}

fn verify_integrity(obj: &Path, hash: &str) -> io::Result<()> {
    let calc = sha256_file(obj)?;
    if calc == hash { Ok(()) } else { Err(io::Error::new(io::ErrorKind::Other, "Hash mismatch")) }
}

#[cfg(unix)]
fn create_symlink(target: &Path, link: &Path) -> io::Result<()> {
    if link.exists() {
        fs::remove_file(link)?;
    }
    unix_fs::symlink(target, link)
}
