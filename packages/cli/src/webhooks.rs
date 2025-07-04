use crate::config::{self, Webhook};
use std::process::Command;

pub fn run(args: &[String]) {
    match args.first().map(|s| s.as_str()) {
        Some("add") => {
            if args.len() < 3 {
                eprintln!("Uso: haven webhook add <discord|jira> <url>");
                return;
            }
            let kind = args[1].clone();
            let url = args[2].clone();
            let mut cfg = config::load();
            cfg.webhooks.push(Webhook { kind, url });
            if let Err(e) = config::save(&cfg) {
                eprintln!("{e}");
            } else {
                println!("Webhook registrado");
            }
        }
        _ => println!("Uso: haven webhook add <discord|jira> <url>"),
    }
}

pub fn dispatch(_event: &str, payload: &str) {
    let cfg = config::load();
    for hook in cfg.webhooks {
        let _ = Command::new("curl")
            .arg("-X")
            .arg("POST")
            .arg(&hook.url)
            .arg("-H")
            .arg("Content-Type: application/json")
            .arg("-d")
            .arg(payload)
            .spawn();
    }
}