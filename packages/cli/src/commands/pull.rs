use std::{fs::{self, File}, io::{self, Read, Write}, path::{Path, PathBuf}};
use serde::Deserialize;

use super::add::StagedEntry;

fn remote_dir() -> PathBuf {
    std::env::var("HAVEN_FS_DIR").map(PathBuf::from).unwrap_or_else(|_| PathBuf::from(".haven/fs"))
}

#[derive(Deserialize)]
struct Snapshot {
    message: String,
    timestamp: u64,
    changes: Vec<StagedEntry>,
}

pub fn run(args: Vec<String>) {
    if let Err(e) = pull_snapshot(args) {
        eprintln!("Pull failed: {e}");
    }
}

fn pull_snapshot(args: Vec<String>) -> io::Result<()> {
    let remote = remote_dir();
    let meta = remote.join("metadata");
    let snapshot = if let Some(name) = args.get(0) {
        meta.join(name)
    } else {
        latest_snapshot(&meta)?
    };

    fs::create_dir_all(".haven/metadata")?;
    let local_snap = Path::new(".haven/metadata").join(snapshot.file_name().unwrap());
    copy_file(&snapshot, &local_snap)?;

    let snap: Snapshot = serde_json::from_str(&fs::read_to_string(&local_snap)?)?;
    for change in snap.changes {
        let remote_obj = remote.join("objects").join(&change.hash);
        let local_obj = Path::new(".haven/objects").join(&change.hash);
        copy_file(&remote_obj, &local_obj)?;

        #[cfg(unix)]
        {
            let _ = fs::remove_file(&change.path);
            std::os::unix::fs::symlink(&local_obj, &change.path)?;
        }
        #[cfg(windows)]
        {
            let _ = fs::remove_file(&change.path);
            std::os::windows::fs::symlink_file(&local_obj, &change.path)?;
        }
    }
    Ok(())
}

fn copy_file(src: &Path, dst: &Path) -> io::Result<()> {
    fs::create_dir_all(dst.parent().unwrap())?;
    if dst.exists() {
        return Ok(());
    }
    let mut input = File::open(src)?;
    let mut output = File::create(dst)?;
    let mut buf = [0u8; 8 * 1024 * 1024];
    loop {
        let n = input.read(&mut buf)?;
        if n == 0 {
            break;
        }
        output.write_all(&buf[..n])?;
    }
    Ok(())
}

fn latest_snapshot(meta: &Path) -> io::Result<PathBuf> {
    let mut entries: Vec<_> = fs::read_dir(meta)?.filter_map(|e| e.ok()).collect();
    entries.sort_by_key(|e| e.file_name());
    entries
        .into_iter()
        .filter(|e| e.path().extension().map(|s| s == "json").unwrap_or(false))
        .last()
        .map(|e| Ok(e.path()))
        .unwrap_or_else(|| Err(io::Error::new(io::ErrorKind::NotFound, "snapshot not found")))
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;
    use serde_json::json;

    #[test]
    fn download_snapshot() {
        let dir = tempdir().unwrap();
        std::env::set_current_dir(&dir).unwrap();
        let remote = dir.path().join("remote");
        std::env::set_var("HAVEN_FS_DIR", remote.to_str().unwrap());

        fs::create_dir_all(remote.join("objects")).unwrap();
        fs::create_dir_all(remote.join("metadata")).unwrap();

        fs::create_dir_all(".haven/objects").unwrap();
        fs::create_dir_all(".haven/metadata").unwrap();

        fs::write(remote.join("objects/abc"), b"data").unwrap();
        let snap = json!({"message":"m","timestamp":1,"changes":[{"path":"file","hash":"abc"}]});
        fs::write(remote.join("metadata/1.json"), snap.to_string()).unwrap();

        run(vec!["1.json".into()]);

        assert!(Path::new("file").exists());
        let link = fs::read_link("file").unwrap();
        assert!(link.ends_with("abc"));
    }
}
