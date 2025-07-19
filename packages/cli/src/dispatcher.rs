use crate::commands;
use crate::commands::symbols::{Dispatcher, DispatcherResult, HavenCommand, HavenFunction};

fn prepare_command(cmd: &Dispatcher) -> HavenFunction {
    match cmd.command {
        Some(HavenCommand::Init) => commands::init::run,
        // Some(HavenCommand::Add) => println!("Add"),
        // Some(HavenCommand::Tag) => println!("Tag"),
        // Some(HavenCommand::Reference) => println!("Reference"),
        // Some(HavenCommand::Bloom) => println!("Bloom"),
        // Some(HavenCommand::Commit) => println!("Commit"),
        // Some(HavenCommand::Checkout) => println!("Checkout"),
        // Some(HavenCommand::Merge) => println!("Merge"),
        // Some(HavenCommand::Rebase) => println!("Rebase"),
        // Some(HavenCommand::Reset) => println!("Reset"),
        // Some(HavenCommand::Status) => println!("Status"),
        // Some(HavenCommand::Help) => println!("Help"),
        // Some(HavenCommand::Trash) => println!("Trash"),
        // Some(HavenCommand::Vine) => println!("Vine"),
        // Some(HavenCommand::Config) => println!("Config"),
        // Some(HavenCommand::Version) => println!("Version"),
        // Some(HavenCommand::Library) => println!("Library"),
        // Some(HavenCommand::Decay) => println!("Decay"),
        // Some(HavenCommand::Sprout) => println!("Sprout"),
        // Some(HavenCommand::Garden) => println!("Garden"),
        // Some(HavenCommand::Harvest) => println!("Harvest"),
        // Some(HavenCommand::Growth) => println!("Growth"),
        // Some(HavenCommand::Edict) => println!("Edict"),
        None => commands::no_command::run,
        _ => commands::no_command::run,
    }
}

pub fn execute(cmd: &Dispatcher) -> DispatcherResult {
    let command_to_run = prepare_command(cmd);
    command_to_run(cmd)
}
