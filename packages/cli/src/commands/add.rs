use std::{
    fs::{self, File, OpenOptions},
    io::{self, Read, Write},
    path::Path,
};

use sha2::{Digest, Sha256};
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct StagedEntry {
    pub path: String,
    pub hash: String,
}

pub fn run(args: Vec<String>) {
    if args.is_empty() {
        println!("No files specified.");
        return;
    }
    for file in args {
        if let Err(e) = add_file(Path::new(&file)) {
            eprintln!("Failed to add {}: {}", file, e);
        }
    }
}

pub fn add_file(path: &Path) -> io::Result<()> {
    let mut f = File::open(path)?;
    let mut data = Vec::new();
    f.read_to_end(&mut data)?;

    let mut hasher = Sha256::new();
    hasher.update(&data);
    let hash = format!("{:x}", hasher.finalize());

    fs::create_dir_all(".haven/objects")?;
    let object_path = Path::new(".haven/objects").join(&hash);
    if !object_path.exists() {
        fs::write(&object_path, &data)?;
    }

    fs::remove_file(path)?;
    #[cfg(unix)]
    std::os::unix::fs::symlink(&object_path, path)?;
    #[cfg(windows)]
    std::os::windows::fs::symlink_file(&object_path, path)?;

    fs::create_dir_all(".haven")?;
    let staging_path = Path::new(".haven/staging");
    let mut staging = OpenOptions::new()
        .create(true)
        .append(true)
        .open(staging_path)?;

    let entry = StagedEntry {
        path: path.to_string_lossy().into_owned(),
        hash,
    };
    writeln!(staging, "{}", serde_json::to_string(&entry).unwrap())?;

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;

    #[test]
    fn deduplication() {
        let dir = tempfile::tempdir().unwrap();
        std::env::set_current_dir(&dir).unwrap();
        fs::create_dir_all(".haven/objects").unwrap();

        fs::write("file1.txt", b"hello").unwrap();
        fs::write("file2.txt", b"hello").unwrap();

        run(vec!["file1.txt".into(), "file2.txt".into()]);

        let count = fs::read_dir(".haven/objects").unwrap().count();
        assert_eq!(count, 1);

        assert!(fs::read_link("file1.txt").is_ok());
        assert!(fs::read_link("file2.txt").is_ok());
    }
}
