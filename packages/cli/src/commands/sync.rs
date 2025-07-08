use std::{collections::BTreeMap, fs, path::{Path, PathBuf}};
use sha2::{Digest, Sha256};

fn remote_dir() -> PathBuf {
    std::env::var("HAVEN_FS_DIR").map(PathBuf::from).unwrap_or_else(|_| PathBuf::from(".haven/fs"))
}

pub fn run(_args: Vec<String>) {
    if let Err(e) = sync() {
        eprintln!("Sync failed: {e}");
    }
}

fn sync() -> std::io::Result<()> {
    let local_root = compute_root(Path::new(".haven/objects"))?;
    let remote_root = compute_root(&remote_dir().join("objects"))?;

    if local_root == remote_root {
        println!("Already in sync");
    } else {
        println!("Local root: {local_root}");
        println!("Remote root: {remote_root}");
    }
    Ok(())
}

fn compute_root(dir: &Path) -> std::io::Result<String> {
    let mut map = BTreeMap::new();
    if !dir.exists() {
        return Ok(String::new());
    }
    for entry in fs::read_dir(dir)? {
        let entry = entry?;
        if entry.path().is_file() {
            let data = fs::read(entry.path())?;
            let mut hasher = Sha256::new();
            hasher.update(&data);
            map.insert(entry.file_name(), format!("{:x}", hasher.finalize()));
        }
    }
    let mut hasher = Sha256::new();
    for v in map.values() {
        hasher.update(v.as_bytes());
    }
    Ok(format!("{:x}", hasher.finalize()))
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[test]
    fn root_differs() {
        let dir = tempdir().unwrap();
        std::env::set_current_dir(&dir).unwrap();
        fs::create_dir_all(".haven/objects").unwrap();
        let remote = dir.path().join("remote");
        std::env::set_var("HAVEN_FS_DIR", remote.to_str().unwrap());
        fs::create_dir_all(remote.join("objects")).unwrap();

        fs::write(".haven/objects/a", b"1").unwrap();
        fs::write(remote.join("objects/b"), b"2").unwrap();

        let local_root = compute_root(Path::new(".haven/objects")).unwrap();
        let remote_root = compute_root(&remote.join("objects")).unwrap();
        assert_ne!(local_root, remote_root);
    }
}
