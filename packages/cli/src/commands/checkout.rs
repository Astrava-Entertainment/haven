use std::fs;
use std::fs::File;
use std::io::{self};
use std::path::{Path, PathBuf};

use crate::commands::push::sha256_file;
use crate::commands::pull;
use crate::utils;
use crate::config;

#[cfg(unix)]
use std::os::unix::fs as unix_fs;

pub fn run(args: &[String]) {
    if args.is_empty() {
        if let Err(e) = list_snapshots() {
            eprintln!("{e}");
        }
        return;
    }
    if let Err(e) = checkout_snapshot(&args[0]) {
        eprintln!("{e}");
    }
}

fn list_snapshots() -> io::Result<()> {
    let dir = Path::new(".haven/metadata");
    if !dir.exists() {
        println!("No hay snapshots disponibles");
        return Ok(());
    }
    let mut entries: Vec<_> = fs::read_dir(dir)?
        .filter_map(|e| e.ok())
        .collect();
    entries.sort_by_key(|e| e.file_name());
    for e in entries {
        println!("{}", e.file_name().to_string_lossy());
    }
    Ok(())
}

fn checkout_snapshot(id: &str) -> io::Result<()> {
    let path = find_snapshot(id)?;
    let entries = utils::parse_snapshot(&path)?;
    for (rel, hash) in entries {
        restore_file(&rel, &hash)?;
    }
    Ok(())
}

fn find_snapshot(id: &str) -> io::Result<PathBuf> {
    let mut p = PathBuf::from(id);
    if !p.exists() {
        if !p.extension().map(|e| e == "toml").unwrap_or(false) {
            p = PathBuf::from(format!(".haven/metadata/{}.toml", id));
        }
    }
    if !p.exists() {
        let dir = Path::new(".haven/metadata");
        for entry in fs::read_dir(dir)? {
            let entry = entry?;
            let name = entry.file_name();
            let name = name.to_string_lossy();
            if name.starts_with(id) {
                p = entry.path();
                break;
            }
        }
    }
    if p.exists() {
        Ok(p)
    } else {
        Err(io::Error::new(io::ErrorKind::NotFound, "Snapshot no encontrado"))
    }
}


fn restore_file(rel: &str, hash: &str) -> io::Result<()> {
    let obj_path = Path::new(".haven/objects").join(hash);
    if !obj_path.exists() {
        let remote = config::primary_remote();
        let mut log = File::create(".haven/checkout.log")?;
        pull::pull_object(hash, &remote, &mut log)?;
    }
    if obj_path.exists() {
        verify_integrity(&obj_path, hash)?;
        let dest = Path::new(rel);
        if let Some(parent) = dest.parent() {
            fs::create_dir_all(parent)?;
        }
        if dest.exists() {
            fs::remove_file(dest)?;
        }
        create_symlink(&obj_path, dest)?;
    }
    Ok(())
}

fn verify_integrity(obj: &Path, hash: &str) -> io::Result<()> {
    let calc = sha256_file(obj)?;
    if calc == hash {
        Ok(())
    } else {
        Err(io::Error::new(io::ErrorKind::Other, "Hash mismatch"))
    }
}

#[cfg(unix)]
fn create_symlink(target: &Path, link: &Path) -> io::Result<()> {
    if link.exists() {
        fs::remove_file(link)?;
    }
    unix_fs::symlink(target, link)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::utils;
    use std::io::Write;

    #[test]
    fn parse_snapshot_basic() {
        let tmp = tempfile::tempdir().unwrap();
        let snap = tmp.path().join("s.toml");
        let mut f = File::create(&snap).unwrap();
        writeln!(f, "[[files]]\nhash = \"abc\"\npath = \"foo.txt\"").unwrap();
        let entries = utils::parse_snapshot(&snap).unwrap();
        assert_eq!(entries, vec![("foo.txt".into(), "abc".into())]);
    }
}