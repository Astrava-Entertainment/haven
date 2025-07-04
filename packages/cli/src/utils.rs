use std::fs;
use std::io;
use std::path::Path;

/// Parse a snapshot TOML file and return (path, hash) pairs.
pub fn parse_snapshot(path: &Path) -> io::Result<Vec<(String, String)>> {
    let content = fs::read_to_string(path)?;
    let mut entries = Vec::new();
    let mut hash: Option<String> = None;
    let mut rel: Option<String> = None;
    for line in content.lines() {
        let l = line.trim();
        if let Some(rest) = l.strip_prefix("hash = \"") {
            if let Some(end) = rest.find('"') {
                hash = Some(rest[..end].to_string());
            }
        } else if let Some(rest) = l.strip_prefix("path = \"") {
            if let Some(end) = rest.find('"') {
                rel = Some(rest[..end].to_string());
            }
        }
        if let (Some(h), Some(r)) = (hash.take(), rel.take()) {
            entries.push((r, h));
        }
    }
    Ok(entries)
}
