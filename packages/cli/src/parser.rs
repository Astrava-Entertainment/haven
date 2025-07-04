use crate::commands::symbols::{Dispatcher, HavenCommand};

pub fn germinate() -> Dispatcher {
    let mut args: Vec<String> = std::env::args().skip(1).collect();
    let first = args.first().cloned().unwrap_or_default();
    if !args.is_empty() {
        args.remove(0);
    }
    let command = get_haven_command(&first);
    Dispatcher::new(command, first, args)
}

fn get_haven_command(cmd: &str) -> Option<HavenCommand> {
    match cmd {
        "init" => Some(HavenCommand::Init),
        "add" => Some(HavenCommand::Add),
        "tag" => Some(HavenCommand::Tag),
        "reference" => Some(HavenCommand::Reference),
        "bloom" => Some(HavenCommand::Bloom),
        "commit" => Some(HavenCommand::Commit),
        "push" => Some(HavenCommand::Push),
        "pull" => Some(HavenCommand::Pull),
        "sync" => Some(HavenCommand::Sync),
        "checkout" => Some(HavenCommand::Checkout),
        "mount" => Some(HavenCommand::Mount),
        "merge" => Some(HavenCommand::Merge),
        "rebase" => Some(HavenCommand::Rebase),
        "reset" => Some(HavenCommand::Reset),
        "status" => Some(HavenCommand::Status),
        "help" => Some(HavenCommand::Help),
        "trash" => Some(HavenCommand::Trash),
        "vine" => Some(HavenCommand::Vine),
        "config" => Some(HavenCommand::Config),
        "link" => Some(HavenCommand::Link),
        "version" => Some(HavenCommand::Version),
        "library" => Some(HavenCommand::Library),
        "decay" => Some(HavenCommand::Decay),
        "sprout" => Some(HavenCommand::Sprout),
        "garden" => Some(HavenCommand::Garden),
        "harvest" => Some(HavenCommand::Harvest),
        "growth" => Some(HavenCommand::Growth),
        "edict" => Some(HavenCommand::Edict),
        _ => None,
    }
}
