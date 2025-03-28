﻿pub enum HavenCommand {
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
    Decay, // send a file to the trash
    Sprout, // restore a file from the trash
    Garden, // list all the projects installed in the system
    Harvest, // remove a project from the system
    Growth, // Retrieves the timeline for a file
    Edict, // Open or modify the configuration file
}

pub struct Dispatcher {
    pub command: Option<HavenCommand>,
    pub raw : String,
}

impl Dispatcher {
    pub fn new(command: Option<HavenCommand>, raw: String) -> Self {
        Self {
            command,
            raw,
        }
    }
}