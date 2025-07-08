use serde::{Deserialize, Serialize};
use std::{collections::HashMap, fs, io, path::Path, process::Command};

const REGISTRY: &str = "plugins.json";

#[derive(Serialize, Deserialize, Default)]
struct Registry(HashMap<String, String>);

fn load_registry() -> Registry {
  if let Ok(text) = fs::read_to_string(REGISTRY) {
    serde_json::from_str(&text).unwrap_or_default()
  } else {
    Registry::default()
  }
}

fn save_registry(reg: &Registry) -> io::Result<()> {
  let text = serde_json::to_string_pretty(reg).unwrap();
  fs::write(REGISTRY, text)
}

pub fn find_plugin(name: &str) -> Option<String> {
  let reg = load_registry();
  reg.0.get(name).cloned()
}

pub fn install_plugin(src: &str) -> io::Result<()> {
  let data = if src.starts_with("http://") || src.starts_with("https://") {
    reqwest::blocking::get(src)
      .map_err(|e| io::Error::new(io::ErrorKind::Other, e))?
      .text()
      .map_err(|e| io::Error::new(io::ErrorKind::Other, e))?
  } else {
    fs::read_to_string(src)?
  };

  let fname = Path::new(src)
    .file_name()
    .ok_or_else(|| io::Error::new(io::ErrorKind::InvalidInput, "invalid path"))?
    .to_string_lossy()
    .into_owned();
  fs::create_dir_all("packages/cli/plugins")?;
  let dest = Path::new("packages/cli/plugins").join(&fname);
  fs::write(&dest, data)?;

  let mut reg = load_registry();
  let name = fname.trim_end_matches(".rs");
  reg.0.insert(name.to_string(), format!("./packages/cli/plugins/{}", fname));
  save_registry(&reg)
}

pub fn execute_plugin(path: &str, args: Vec<String>, event: Option<&str>) -> io::Result<()> {
  let out = std::env::temp_dir().join("haven_plugin_bin");
  let status = Command::new("rustc")
    .args(["--edition=2024", path, "-o", out.to_str().unwrap()])
    .status()?;
  if !status.success() {
    return Err(io::Error::new(io::ErrorKind::Other, "compile failed"));
  }
  let mut cmd = Command::new(&out);
  if let Some(ev) = event {
    cmd.env("HAVEN_EVENT", ev);
  }
  let status = cmd.args(args).status()?;
  if !status.success() {
    return Err(io::Error::new(io::ErrorKind::Other, "plugin failed"));
  }
  Ok(())
}

pub fn trigger_event(event: &str) {
  let reg = load_registry();
  for path in reg.0.values() {
    let _ = execute_plugin(path, Vec::new(), Some(event));
  }
}

