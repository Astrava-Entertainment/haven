use crate::commands;
use crate::commands::symbols::{Dispatcher, HavenCommand};

pub fn execute(cmd: Dispatcher) {
    match cmd.command {
        Some(HavenCommand::Init) => commands::init::run(),
        Some(HavenCommand::Add) => commands::add::run(&cmd.args),
        Some(HavenCommand::Tag) => println!("Tag"),
        Some(HavenCommand::Reference) => println!("Reference"),
        Some(HavenCommand::Bloom) => println!("Bloom"),
        Some(HavenCommand::Commit) => commands::commit::run(&cmd.args),
        Some(HavenCommand::Push) => commands::push::run(&cmd.args),
        Some(HavenCommand::Pull) => commands::pull::run(&cmd.args),
        Some(HavenCommand::Sync) => commands::sync::run(&cmd.args),
        Some(HavenCommand::Checkout) => commands::checkout::run(&cmd.args),
        Some(HavenCommand::Mount) => commands::mount::run(&cmd.args),
        Some(HavenCommand::Merge) => println!("Merge"),
        Some(HavenCommand::Rebase) => println!("Rebase"),
        Some(HavenCommand::Reset) => println!("Reset"),
        Some(HavenCommand::Status) => println!("Status"),
        Some(HavenCommand::Help) => println!("Help"),
        Some(HavenCommand::Trash) => println!("Trash"),
        Some(HavenCommand::Vine) => println!("Vine"),
        Some(HavenCommand::Config) => commands::config_cmd::run(&cmd.args),
        Some(HavenCommand::Link) => commands::link::run(&cmd.args),
        Some(HavenCommand::Plugin) => commands::plugin::run(&cmd.args),
        Some(HavenCommand::Webhook) => commands::webhook::run(&cmd.args),
        Some(HavenCommand::Version) => println!("Version"),
        Some(HavenCommand::Library) => println!("Library"),
        Some(HavenCommand::Decay) => println!("Decay"),
        Some(HavenCommand::Sprout) => println!("Sprout"),
        Some(HavenCommand::Garden) => println!("Garden"),
        Some(HavenCommand::Harvest) => println!("Harvest"),
        Some(HavenCommand::Growth) => println!("Growth"),
        Some(HavenCommand::Edict) => println!("Edict"),
        None => println!("No command found for {}", cmd.raw),
    }
}
