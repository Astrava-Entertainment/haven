use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};

#[derive(Serialize, Deserialize, Default)]
pub struct Config {
    #[serde(default)]
    pub project: Project,
    #[serde(default)]
    pub settings: Settings,
    #[serde(default)]
    pub remotes: Vec<Remote>,
}

#[derive(Serialize, Deserialize, Default)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub created: String,
    pub engine: String,
}

#[derive(Serialize, Deserialize)]
pub struct Settings {
    pub chunk_size: usize,
    pub auto_sync: bool,
    pub compression: bool,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            chunk_size: 10 * 1024 * 1024,
            auto_sync: false,
            compression: false,
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Default)]
pub struct Remote {
    pub name: String,
    pub url: String,
}

pub fn load() -> Config {
    let path = Path::new(".haven/config.toml");
    if let Ok(data) = fs::read_to_string(path) {
        toml::from_str(&data).unwrap_or_default()
    } else {
        Config::default()
    }
}

pub fn save(cfg: &Config) -> std::io::Result<()> {
    let data = toml::to_string_pretty(cfg).unwrap();
    fs::write(".haven/config.toml", data)
}

pub fn remote_paths() -> Vec<PathBuf> {
    let cfg = load();
    if cfg.remotes.is_empty() {
        return vec![PathBuf::from(".haven/remote_bucket")];
    }
    cfg.remotes.iter().map(|r| PathBuf::from(&r.url)).collect()
}

pub fn primary_remote() -> PathBuf {
    for p in remote_paths() {
        if p.exists() {
            return p;
        }
    }
    PathBuf::from(".haven/remote_bucket")
}

pub fn chunk_size() -> usize {
    load().settings.chunk_size
}
