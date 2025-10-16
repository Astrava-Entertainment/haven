use crate::logger::symbols::*;
use std::fs::{OpenOptions, create_dir_all};
use std::io;
use std::io::Write;
use std::path::Path;
fn can_log() -> bool {
  true // TODO: Think on how to implement the haven config to enable/disable logging
}

pub fn log_audit(entry: &AuditLogEntry) -> io::Result<()> {
  if !can_log() {
    return Ok(());
  }
  let path = Path::new(HAVEN_LOG_PATH);

  if let Some(parent) = path.parent() {
    create_dir_all(parent)?;
  }

  // Open the file in append mode, create if missing
  let mut file = OpenOptions::new().create(true).append(true).open(path)?;

  writeln!(
    file,
    "[{}] CMD={} SUCCESS={} MSG={}",
    entry.timestamp, entry.command, entry.success, entry.message
  )?;

  Ok(())
}
