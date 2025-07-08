use std::{
    env,
    fs::{self, OpenOptions},
    io::{Read, Write},
    path::Path,
    process::Command,
    time::{SystemTime, UNIX_EPOCH},
};

pub fn run() {
    println!("Initializing Haven workspace...");

    create_structure();
    write_config();
    init_git_repo();
    update_gitignore();
    simulate_fuse();
}

fn create_structure() {
    if !Path::new(".haven").exists() {
        fs::create_dir(".haven").expect("failed to create .haven directory");
    }
    let objects = Path::new(".haven/objects");
    if !objects.exists() {
        fs::create_dir_all(objects).expect("failed to create objects directory");
    }
    let metadata = Path::new(".haven/metadata");
    if !metadata.exists() {
        fs::create_dir_all(metadata).expect("failed to create metadata directory");
    }
}

fn write_config() {
    let cfg_path = Path::new(".haven/config.toml");
    if cfg_path.exists() {
        return;
    }
    let uuid = generate_uuid();
    let unreal = detect_engine(&["ue4editor", "UnrealEditor"]);
    let godot = detect_engine(&["godot"]);
    let unity = detect_engine(&["unity", "Unity"]);

    let mut file = fs::File::create(cfg_path).expect("failed to create config file");
    writeln!(file, "[core]\nuuid = \"{}\"", uuid).unwrap();
    writeln!(file, "\n[engines]\nunreal = {}\ngodot = {}\nunity = {}", unreal, godot, unity).unwrap();
}

fn generate_uuid() -> String {
    let mut bytes = [0u8; 16];
    if let Ok(mut f) = fs::File::open("/dev/urandom") {
        let _ = f.read_exact(&mut bytes);
    } else {
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        bytes = now.to_le_bytes();
    }
    let sections = [
        &bytes[0..4],
        &bytes[4..6],
        &bytes[6..8],
        &bytes[8..10],
        &bytes[10..16],
    ];
    let mut out = String::new();
    for (i, part) in sections.iter().enumerate() {
        for b in *part {
            out.push_str(&format!("{:02x}", b));
        }
        if i < 4 {
            out.push('-');
        }
    }
    out
}

fn detect_engine(names: &[&str]) -> bool {
    if let Ok(paths) = env::var("PATH") {
        for path in paths.split(':') {
            for n in names {
                if Path::new(path).join(n).exists() {
                    return true;
                }
            }
        }
    }
    false
}

fn init_git_repo() {
    if !Path::new(".git").exists() {
        let _ = Command::new("git").arg("init").status();
    }
    let has_trunk = Command::new("git")
        .args(["rev-parse", "--verify", "trunk"])
        .output()
        .map(|o| o.status.success())
        .unwrap_or(false);
    if !has_trunk {
        let _ = Command::new("git").args(["branch", "trunk"]).status();
    }
}

fn update_gitignore() {
    let path = Path::new(".gitignore");
    let mut content = String::new();
    if path.exists() {
        if let Ok(c) = fs::read_to_string(path) {
            content = c;
        }
    }
    if !content.contains(".haven/") {
        let mut file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(path)
            .expect("unable to open .gitignore");
        if !content.ends_with('\n') && !content.is_empty() {
            writeln!(file).unwrap();
        }
        writeln!(file, ".haven/").unwrap();
    }
}

fn simulate_fuse() {
    println!("FUSE simulation active");
}
