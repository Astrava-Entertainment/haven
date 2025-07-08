use crate::webhooks;

pub fn run(args: Vec<String>) {
  if args.len() == 3 && args[0] == "add" {
    if let Err(e) = webhooks::add(&args[1], &args[2]) {
      eprintln!("Failed to add webhook: {e}");
    }
  } else {
    eprintln!("Usage: haven webhook add <discord|jira> <url>");
  }
}

