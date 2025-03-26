use clap::{Arg, Command};
use crate::commands::symbols::{Dispatcher, HavenCommand};

pub fn germinate() -> Dispatcher {
    let matches = Command::new("haven")
        .about("Rooted in security, cultivate your creativity, branch endless ideas and harvest innovation with Haven. \n Usage: haven [command] [options] \n Run haven help <command> for more details.")
        .arg(Arg::new("command")
            .required(true)
            .help("The command to run"))
        .get_matches();

    let first_match = matches.get_one::<String>("command").unwrap().to_string();
    let command = get_haven_command(&first_match);

    let dispatcher = Dispatcher::new(command, first_match);
    dispatcher
}

fn get_haven_command(cmd: &str) -> Option<HavenCommand> {
    match cmd {
        "init" => Some(HavenCommand::Init),
        "add" => Some(HavenCommand::Add),
        "tag" => Some(HavenCommand::Tag),
        "reference" => Some(HavenCommand::Reference),
        "bloom" => Some(HavenCommand::Bloom),
        "commit" => Some(HavenCommand::Commit),
        "checkout" => Some(HavenCommand::Checkout),
        "merge" => Some(HavenCommand::Merge),
        "rebase" => Some(HavenCommand::Rebase),
        "reset" => Some(HavenCommand::Reset),
        "status" => Some(HavenCommand::Status),
        "help" => Some(HavenCommand::Help),
        "trash" => Some(HavenCommand::Trash),
        "vine" => Some(HavenCommand::Vine),
        "config" => Some(HavenCommand::Config),
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