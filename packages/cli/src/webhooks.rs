use serde::{Deserialize, Serialize};
use std::{fs, io};

const FILE: &str = "webhooks.json";

#[derive(Serialize, Deserialize, Default)]
pub struct Webhooks {
  pub discord: Option<String>,
  pub jira: Option<String>,
}

fn load() -> io::Result<Webhooks> {
  let text = fs::read_to_string(FILE).unwrap_or_default();
  if text.is_empty() {
    Ok(Webhooks::default())
  } else {
    serde_json::from_str(&text).map_err(|e| io::Error::new(io::ErrorKind::InvalidData, e))
  }
}

fn save(hooks: &Webhooks) -> io::Result<()> {
  let text = serde_json::to_string_pretty(hooks).unwrap();
  fs::write(FILE, text)
}

pub fn add(target: &str, url: &str) -> io::Result<()> {
  url::Url::parse(url).map_err(|_| io::Error::new(io::ErrorKind::InvalidInput, "invalid url"))?;
  let mut hooks = load().unwrap_or_default();
  match target {
    "discord" => hooks.discord = Some(url.to_string()),
    "jira" => hooks.jira = Some(url.to_string()),
    _ => return Err(io::Error::new(io::ErrorKind::InvalidInput, "unknown target")),
  }
  save(&hooks)
}

pub fn notify(event: &str) {
  if let Ok(hooks) = load() {
    if let Some(url) = hooks.discord.as_deref() {
      let _ = reqwest::blocking::Client::new().post(url).json(&serde_json::json!({"event": event})).send();
    }
    if let Some(url) = hooks.jira.as_deref() {
      let _ = reqwest::blocking::Client::new().post(url).json(&serde_json::json!({"event": event})).send();
    }
  }
}

