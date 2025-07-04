use std::fs::{self, OpenOptions};
use std::io::{self, Write};
use chrono::Utc;
use std::path::Path;
use uuid::Uuid;
use crate::{plugins, webhooks};

pub fn run(args: &[String]) {
    let message = parse_message(args);
    if let Err(e) = commit_snapshot(message.as_deref()) {
        eprintln!("{e}");
    }
}

fn parse_message(args: &[String]) -> Option<String> {
    let mut iter = args.iter();
    while let Some(arg) = iter.next() {
        if arg == "-m" {
            return iter.next().cloned();
        }
    }
    None
}

fn commit_snapshot(message: Option<&str>) -> io::Result<()> {
    let staging_dir = Path::new(".haven/staging");
    if !staging_dir.exists() || !staging_dir.is_dir() {
        println!("No hay archivos en staging");
        return Ok(());
    }

    let mut entries: Vec<(String, String)> = Vec::new();
    for entry in fs::read_dir(staging_dir)? {
        let entry = entry?;
        if entry.file_type()?.is_file() {
            let content = fs::read_to_string(entry.path())?;
            let mut parts = content.splitn(3, ' ');
            if let (Some(hash), Some(path), _) = (parts.next(), parts.next(), parts.next()) {
                entries.push((hash.to_string(), path.to_string()));
            }
        }
    }

    if entries.is_empty() {
        println!("No hay archivos en staging");
        return Ok(());
    }

    let timestamp = Utc::now().to_rfc3339();
    fs::create_dir_all(".haven/metadata")?;
    let snapshot_file = format!(".haven/metadata/{}.toml", timestamp.replace(':', "-"));
    let mut file = OpenOptions::new().create(true).write(true).open(&snapshot_file)?;
    if let Some(msg) = message {
        writeln!(file, "message = \"{}\"", msg)?;
    }
    writeln!(file, "timestamp = \"{}\"", timestamp)?;
    for (hash, path) in entries {
        writeln!(file, "\n[[files]]")?;
        writeln!(file, "hash = \"{}\"", hash)?;
        writeln!(file, "path = \"{}\"", path)?;
    }

    for entry in fs::read_dir(staging_dir)? {
        let entry = entry?;
        if entry.file_type()?.is_file() {
            fs::remove_file(entry.path())?;
        }
    }

    println!("Snapshot creado en {}", snapshot_file);

    let payload = format!(
        "{{\"event\":\"commit\",\"user\":\"{}\",\"hash\":\"{}\",\"message\":\"{}\",\"timestamp\":\"{}\"}}",
        std::env::var("USER").unwrap_or_default(),
        Uuid::new_v4().to_string(),
        message.unwrap_or(""),
        timestamp
    );
    plugins::trigger("onCommit", &payload);
    webhooks::dispatch("commit", &payload);
    Ok(())
}