use std::{
    fs::{self, File, OpenOptions},
    io::{self, Write},
    path::Path,
    time::{SystemTime, UNIX_EPOCH},
};

use serde::{Serialize, Deserialize};

use super::add::StagedEntry;

#[derive(Serialize, Deserialize)]
struct Snapshot {
    message: String,
    timestamp: u64,
    changes: Vec<StagedEntry>,
}

pub fn run(args: Vec<String>) {
    if args.is_empty() {
        println!("Commit message required");
        return;
    }
    let message = args.join(" ");
    if let Err(e) = commit(&message) {
        eprintln!("Commit failed: {}", e);
    } else {
        crate::webhooks::notify("onCommit");
        crate::plugin_manager::trigger_event("onCommit");
    }
}

fn commit(message: &str) -> io::Result<()> {
    let staging_path = Path::new(".haven/staging");
    if !staging_path.exists() {
        return Ok(());
    }
    let content = fs::read_to_string(staging_path)?;
    if content.trim().is_empty() {
        return Ok(());
    }
    let entries: Vec<StagedEntry> = content
        .lines()
        .filter_map(|l| serde_json::from_str(l).ok())
        .collect();

    let snapshot = Snapshot {
        message: message.to_string(),
        timestamp: SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs(),
        changes: entries,
    };
    fs::create_dir_all(".haven/metadata")?;
    let filename = format!("{}.json", snapshot.timestamp);
    let mut file = File::create(Path::new(".haven/metadata").join(&filename))?;
    serde_json::to_writer(&mut file, &snapshot).unwrap();

    let mut index = OpenOptions::new()
        .create(true)
        .append(true)
        .open(".haven/metadata/index")?;
    writeln!(index, "{}", filename)?;

    fs::remove_file(staging_path)?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::commands::add;
    use std::fs;

    #[test]
    fn snapshot_restores() {
        let dir = tempfile::tempdir().unwrap();
        std::env::set_current_dir(&dir).unwrap();
        fs::create_dir_all(".haven/objects").unwrap();
        fs::create_dir_all(".haven/metadata").unwrap();

        fs::write("file.txt", b"data").unwrap();
        add::run(vec!["file.txt".into()]);
        run(vec!["initial".into()]);

        // remove file to simulate restore
        fs::remove_file("file.txt").unwrap();

        // read snapshot
        let meta = fs::read_dir(".haven/metadata")
            .unwrap()
            .find(|e| {
                e.as_ref()
                    .unwrap()
                    .file_name()
                    .to_string_lossy()
                    .ends_with(".json")
            })
            .unwrap()
            .unwrap()
            .path();
        let snap: Snapshot = serde_json::from_str(&fs::read_to_string(meta).unwrap()).unwrap();
        for change in snap.changes {
            let obj = Path::new(".haven/objects").join(change.hash);
            #[cfg(unix)]
            std::os::unix::fs::symlink(&obj, &change.path).unwrap();
            #[cfg(windows)]
            std::os::windows::fs::symlink_file(&obj, &change.path).unwrap();
        }
        assert!(fs::read_link("file.txt").is_ok());
    }
}
