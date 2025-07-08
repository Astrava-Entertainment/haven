use serde::{Deserialize, Serialize};
use std::{fs::{self, OpenOptions}, io::{self, Write}, path::{Path, PathBuf}};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Bucket {
    pub url: String,
    pub priority: u32,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Config {
    pub chunk_size: usize,
    pub compression: Option<String>,
    pub buckets: Vec<Bucket>,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            chunk_size: 8 * 1024 * 1024,
            compression: None,
            buckets: vec![Bucket { url: String::from(".haven/fs"), priority: 1 }],
        }
    }
}

fn cfg_path() -> PathBuf {
    PathBuf::from(".haven/config.toml")
}

pub fn load() -> io::Result<Config> {
    let path = cfg_path();
    if !path.exists() {
        return Ok(Config::default());
    }
    let content = fs::read_to_string(path)?;
    toml::from_str(&content).map_err(|e| io::Error::new(io::ErrorKind::InvalidData, e))
}

pub fn save(cfg: &Config) -> io::Result<()> {
    let path = cfg_path();
    fs::create_dir_all(path.parent().unwrap())?;
    let content = toml::to_string_pretty(cfg).map_err(|e| io::Error::new(io::ErrorKind::Other, e))?;
    fs::write(path, content)
}

pub fn set_option(key: &str, value: &str) -> io::Result<()> {
    let mut cfg = load().unwrap_or_default();
    match key {
        "chunk_size" => cfg.chunk_size = value.parse().unwrap_or(cfg.chunk_size),
        "compression" => cfg.compression = if value.is_empty() { None } else { Some(value.to_string()) },
        _ => return Err(io::Error::new(io::ErrorKind::InvalidInput, "unknown option")),
    }
    save(&cfg)
}

pub fn add_bucket(url: &str, priority: u32) -> io::Result<()> {
    validate_bucket(url)?;
    let mut cfg = load().unwrap_or_default();
    if cfg.buckets.iter().any(|b| b.url == url) {
        return Ok(());
    }
    cfg.buckets.push(Bucket { url: url.to_string(), priority });
    cfg.buckets.sort_by_key(|b| b.priority);
    save(&cfg)
}

fn validate_bucket(url: &str) -> io::Result<()> {
    if url.contains("://") {
        if std::env::var("HAVEN_KEY").is_err() {
            return Err(io::Error::new(io::ErrorKind::PermissionDenied, "missing HAVEN_KEY"));
        }
        // pretend to validate remote key
        return Ok(());
    }
    let path = Path::new(url);
    fs::create_dir_all(path)?;
    let test = path.join(".haven_perm_test");
    let _ = OpenOptions::new().create(true).write(true).open(&test)?;
    fs::remove_file(test)?;
    Ok(())
}

pub fn buckets() -> io::Result<Vec<Bucket>> {
    Ok(load().unwrap_or_default().buckets)
}
