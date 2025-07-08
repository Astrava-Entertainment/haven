use std::{fs::{self, File, OpenOptions}, io::{self, Read, Seek, SeekFrom, Write}, path::Path};
use fs::{buckets, load};

const CHUNK_SIZE: usize = 8 * 1024 * 1024; // fallback for tests

pub fn run(_args: Vec<String>) {
    if let Err(e) = push_all() {
        eprintln!("Push failed: {e}");
    }
}

fn push_all() -> io::Result<()> {
    let cfg = load().unwrap_or_default();
    let chunk = cfg.chunk_size;
    let buckets = buckets()?;
    let objects = Path::new(".haven/objects");

    for entry in fs::read_dir(objects)? {
        let entry = entry?;
        let local_path = entry.path();
        if local_path.is_file() {
            for bucket in &buckets {
                let remote = Path::new(&bucket.url).join("objects").join(entry.file_name());
                if let Some(parent) = remote.parent() { fs::create_dir_all(parent)?; }
                upload_file(&local_path, &remote, chunk)?;
            }
        }
    }
    Ok(())
}

fn upload_file(local: &Path, remote: &Path, chunk_size: usize) -> io::Result<()> {
    let mut src = File::open(local)?;
    let mut dst = OpenOptions::new().create(true).append(true).open(remote)?;

    let remote_len = dst.metadata()?.len();
    if remote_len > 0 {
        src.seek(SeekFrom::Start(remote_len))?;
        dst.seek(SeekFrom::Start(remote_len))?;
    }

    let mut buffer = vec![0u8; chunk_size];
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
        fs::create_dir_all(".haven").unwrap();
        fs::write(
            ".haven/config.toml",
            format!("chunk_size = {}\n[[buckets]]\nurl = \"{}\"\npriority = 1\n", CHUNK_SIZE, remote.to_string_lossy()),
        )
        .unwrap();

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
