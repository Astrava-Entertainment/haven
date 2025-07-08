use std::{fs::{self, File, OpenOptions}, io::{self, Read, Seek, SeekFrom, Write}, path::{Path, PathBuf}};

const CHUNK_SIZE: usize = 8 * 1024 * 1024; // 8MB

fn remote_dir() -> PathBuf {
    std::env::var("HAVEN_FS_DIR").map(PathBuf::from).unwrap_or_else(|_| PathBuf::from(".haven/fs"))
}

pub fn run(_args: Vec<String>) {
    if let Err(e) = push_all() {
        eprintln!("Push failed: {e}");
    }
}

fn push_all() -> io::Result<()> {
    let objects = Path::new(".haven/objects");
    let remote = remote_dir().join("objects");
    fs::create_dir_all(&remote)?;

    for entry in fs::read_dir(objects)? {
        let entry = entry?;
        let local_path = entry.path();
        if local_path.is_file() {
            let remote_path = remote.join(entry.file_name());
            upload_file(&local_path, &remote_path)?;
        }
    }
    Ok(())
}

fn upload_file(local: &Path, remote: &Path) -> io::Result<()> {
    let mut src = File::open(local)?;
    let mut dst = OpenOptions::new().create(true).append(true).open(remote)?;

    let remote_len = dst.metadata()?.len();
    if remote_len > 0 {
        src.seek(SeekFrom::Start(remote_len))?;
        dst.seek(SeekFrom::Start(remote_len))?;
    }

    let mut buffer = vec![0u8; CHUNK_SIZE];
    loop {
        let read = src.read(&mut buffer)?;
        if read == 0 {
            break;
        }
        dst.write_all(&buffer[..read])?;
        println!("Uploaded {} bytes to {}", read, remote.display());
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[test]
    fn resume_upload() {
        let dir = tempdir().unwrap();
        std::env::set_current_dir(&dir).unwrap();
        fs::create_dir_all(".haven/objects").unwrap();
        let remote = dir.path().join("remote");
        std::env::set_var("HAVEN_FS_DIR", remote.to_str().unwrap());

        let local_file = Path::new(".haven/objects/file1");
        fs::write(&local_file, vec![1u8; CHUNK_SIZE + 10]).unwrap();

        let remote_file = remote.join("objects/file1");
        fs::create_dir_all(remote_file.parent().unwrap()).unwrap();
        let mut f = File::create(&remote_file).unwrap();
        f.write_all(&vec![1u8; CHUNK_SIZE]).unwrap();

        run(Vec::new());

        let local = fs::read(local_file).unwrap();
        let remote = fs::read(remote_file).unwrap();
        assert_eq!(local, remote);
    }
}
