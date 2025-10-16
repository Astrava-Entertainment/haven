use serde::Serialize;

pub const HAVEN_LOG_PATH: &str = "./tmp/haven.log"; // TODO: Change to the haven log path

#[derive(Serialize)]
pub struct AuditLogEntry {
  pub timestamp: String,
  pub raw_input: String,
  pub command: String,
  pub success: bool,
  pub message: String,
}