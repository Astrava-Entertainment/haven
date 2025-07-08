use fs::{load, set_option};

pub fn run(args: Vec<String>) {
    if args.is_empty() || args[0] == "list" {
        match load() {
            Ok(cfg) => {
                println!("{}", toml::to_string_pretty(&cfg).unwrap());
            }
            Err(e) => eprintln!("Failed to load config: {e}"),
        }
    } else if args.len() >= 3 && args[0] == "set" {
        if let Err(e) = set_option(&args[1], &args[2]) {
            eprintln!("Failed to set option: {e}");
        }
    } else {
        eprintln!("Usage: haven config [list|set <key> <value>]");
    }
}
