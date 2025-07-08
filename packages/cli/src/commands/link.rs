use fs::add_bucket;

pub fn run(args: Vec<String>) {
    if args.is_empty() {
        eprintln!("Bucket URL required");
        return;
    }
    let url = &args[0];
    let priority = args.get(1).and_then(|v| v.parse().ok()).unwrap_or(1);
    match add_bucket(url, priority) {
        Ok(_) => println!("Linked {url} with priority {priority}"),
        Err(e) => eprintln!("Failed to link bucket: {e}"),
    }
}
