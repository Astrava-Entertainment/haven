use crate::clap::symbols::PotSubCommands;
use crate::dispatcher::*;

#[derive(Debug)]
pub enum CoreHavenCommand {
    Init,
    Add,
    Tag,
    Reference,
    Bloom, //Automatically organise the files in the project
    Commit,
    Checkout,
    Merge,
    Rebase,
    Reset,
    Status,
    Help,
    Trash,
    Vine,
    Config,
    Version,
    Library,
    Pot(PotSubCommands), // Manage your local pot
    Decay, // send a file to the trash
    Sprout, // restore a file from the trash
    Garden, // list all the projects installed in the system
    Harvest, // remove a project from the system
    Growth, // Retrieves the timeline for a file
    Edict, // Open or modify the configuration file
    NoCommand, // No command found
}

pub type HavenFunction = fn(cmd: &Dispatcher) -> DispatcherResult;
