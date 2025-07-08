use crate::plugin_manager;

pub fn run(args: Vec<String>) {
  if args.len() == 2 && args[0] == "install" {
    if let Err(e) = plugin_manager::install_plugin(&args[1]) {
      eprintln!("Failed to install plugin: {e}");
    }
  } else {
    eprintln!("Usage: haven plugin install <path|url>");
  }
}

