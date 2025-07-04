use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;

use crate::config::{self, PluginEntry};

pub fn run(args: &[String]) {
    match args.first().map(|s| s.as_str()) {
        Some("install") => {
            if let Some(target) = args.get(1) {
                if let Err(e) = install(target) {
                    eprintln!("{e}");
                }
            } else {
                eprintln!("Uso: haven plugin install <ruta|url>");
            }
        }
        _ => println!("Uso: haven plugin install <ruta|url>"),
    }
}

fn install(target: &str) -> std::io::Result<()> {
    let (source_dir, data) = if target.starts_with("http://") || target.starts_with("https://") {
        let base = target.trim_end_matches('/');
        let tmp = std::env::temp_dir().join("haven_plugin_download");
        fs::create_dir_all(&tmp)?;
        let manifest_tmp = tmp.join("manifest.json");
        let status = Command::new("curl")
            .arg("-sL")
            .arg(format!("{}/manifest.json", base))
            .arg("-o")
            .arg(&manifest_tmp)
            .status();
        if let Ok(s) = status {
            if !s.success() {
                return Err(std::io::Error::new(std::io::ErrorKind::Other, "no se pudo descargar manifest.json"));
            }
        } else {
            return Err(std::io::Error::new(std::io::ErrorKind::Other, "curl no disponible"));
        }
        let data = fs::read_to_string(&manifest_tmp)?;
        (tmp, data)
    } else {
        let source = Path::new(target);
        let manifest_path = source.join("manifest.json");
        if !manifest_path.exists() {
            return Err(std::io::Error::new(std::io::ErrorKind::Other, "manifest.json no encontrado"));
        }
        let data = fs::read_to_string(&manifest_path)?;
        (source.to_path_buf(), data)
    };

    let name = extract_field(&data, "name").unwrap_or_else(|| "plugin".to_string());
    let events_raw = extract_field(&data, "events").unwrap_or_default();
    for ev in events_raw.split(',') {
        match ev.trim_matches(&['"', '[', ']', ' '][..]) {
            "onCommit" | "onPush" | "onSync" | "" => {}
            _ => return Err(std::io::Error::new(std::io::ErrorKind::Other, "evento no soportado")),
        }
    }
    let dest = Path::new(".haven/plugins").join(&name);
    fs::create_dir_all(&dest)?;
    for entry in ["manifest.json", "entry.py", "entry"].iter() {
        let p = source_dir.join(entry);
        if p.exists() {
            fs::copy(&p, dest.join(entry))?;
        } else if target.starts_with("http://") || target.starts_with("https://") {
            let url = format!("{}/{}", target.trim_end_matches('/'), entry);
            let _ = Command::new("curl")
                .arg("-sL")
                .arg(&url)
                .arg("-o")
                .arg(dest.join(entry))
                .status();
        }
    }

    let mut cfg = config::load();
    cfg.plugins.push(PluginEntry { name: name.to_string(), path: dest.to_string_lossy().to_string() });
    config::save(&cfg)?;
    println!("Plugin {} instalado", name);
    Ok(())
}

fn extract_field(data: &str, field: &str) -> Option<String> {
    let key = format!("\"{}\"", field);
    if let Some(start) = data.find(&key) {
        let rest = &data[start + key.len()..];
        if let Some(colon) = rest.find(':') {
            let after = &rest[colon + 1..];
            let mut depth = 0;
            let mut end_idx = 0;
            for (i, c) in after.chars().enumerate() {
                match c {
                    '[' => depth += 1,
                    ']' => {
                        if depth > 0 { depth -= 1; }
                    }
                    ',' => if depth == 0 { end_idx = i; break; },
                    '\n' | '\r' => if depth == 0 { end_idx = i; break; },
                    _ => {}
                }
                end_idx = i + 1;
            }
            return Some(after[..end_idx].trim().trim_matches(',').trim().to_string());
        }
    }
    None
}