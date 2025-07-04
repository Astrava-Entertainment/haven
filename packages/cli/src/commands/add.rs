use std::fs::{self, File};
use std::io::{self, Read, Write};
use std::path::Path;
use uuid::Uuid;
use sha2::{Digest, Sha256};
use chrono::Utc;

#[cfg(unix)]
use std::os::unix::fs as unix_fs;

pub fn run(args: &[String]) {
    if args.is_empty() {
        println!("Error: se debe especificar un archivo o directorio");
        return;
    }
    for item in args {
        let path = Path::new(item);
        if let Err(e) = add_path(path) {
            eprintln!("{e}");
        }
    }
}

fn add_path(path: &Path) -> io::Result<()> {
    if path.is_dir() {
        for entry in fs::read_dir(path)? {
            let entry = entry?;
            add_path(&entry.path())?;
        }
        return Ok(());
    }
    if !path.is_file() {
        return Ok(());
    }
    let hash = sha256(path)?;
    let objects_dir = Path::new(".haven/objects");
    fs::create_dir_all(objects_dir)?;
    let obj_path = objects_dir.join(&hash);
    if !obj_path.exists() {
        fs::copy(path, &obj_path)?;
    }
    create_symlink(&obj_path, path)?;
    register_staging(path, &hash)?;
    Ok(())
}

fn sha256(path: &Path) -> io::Result<String> {
    let mut file = File::open(path)?;
    let mut hasher = Sha256::new();
    let mut buffer = [0u8; 8192];
    loop {
        let n = file.read(&mut buffer)?;
        if n == 0 { break; }
        hasher.update(&buffer[..n]);
    }
    Ok(format!("{:x}", hasher.finalize()))
}

#[cfg(unix)]
fn create_symlink(target: &Path, link: &Path) -> io::Result<()> {
    if link.exists() {
        fs::remove_file(link)?;
    }
    unix_fs::symlink(target, link)
}

fn register_staging(path: &Path, hash: &str) -> io::Result<()> {
    let staging_dir = Path::new(".haven/staging");
    fs::create_dir_all(staging_dir)?;
    let entry_name = Uuid::new_v4().to_string();
    let entry_path = staging_dir.join(entry_name);
    let mut file = File::create(entry_path)?;
    let relative = path.strip_prefix(std::env::current_dir()?).unwrap_or(path);
    writeln!(file, "{} {} {}", hash, relative.display(), Utc::now().to_rfc3339())
}