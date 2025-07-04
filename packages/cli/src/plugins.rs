use std::fs;
use std::path::Path;
use std::process::Command;

use crate::config;


pub fn trigger(event: &str, payload: &str) {
    let cfg = config::load();
    for plugin in cfg.plugins {
        let manifest_path = Path::new(&plugin.path).join("manifest.json");
        let Ok(data) = fs::read_to_string(&manifest_path) else { continue };
        if data.contains(event) {
            let entry_py = Path::new(&plugin.path).join("entry.py");
            let entry = if entry_py.exists() {
                entry_py
            } else {
                Path::new(&plugin.path).join("entry")
            };
            let _ = Command::new(entry).arg(event).arg(payload).spawn();
        }
    }
}
