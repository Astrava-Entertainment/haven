use std::path::PathBuf;
use git2::Repository;
use crate::commands::symbols::{Dispatcher, DispatcherResult};

pub fn run(cmd: &Dispatcher) -> DispatcherResult {
    let result = "The Grove is Born! The Seed is Planted! The Garden is Ready!";
    println!("{}", result);
    is_git_repo("/");
    DispatcherResult::output(cmd, true, result)
}


pub fn init_repo(path: &str) -> bool {
    let repo = match Repository::init(path) {
        Ok(repo) => repo,
        Err(_) => {
            println!("This is not a git repository.");
            return false;
        }
    };
    true
}

pub fn is_haven_repo(path: &str) -> bool {
    // Check if the selected directory is a haven repository
    let path = PathBuf::from(path);
    let mut current_path = path.clone();
    loop {
        if current_path.join(".haven").try_exists() {
            println!("This is a haven repository.");
            return true;
        }
        if !current_path.pop() {
            break;
        }
    }
    println!("This is not a haven repository.");
    false
}

pub fn is_git_repo(path: &str) -> bool {
    // Check if the selected directory is a git repository
    // let working_dir = &index;
    match Repository::open(path) {
        Ok(_) => {
            println!("This is a git repository.");
            true
        }
        Err(_) => {
            println!("This is not a git repository.");
            false
        }
    }
}