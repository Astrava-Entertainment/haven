use std::collections::HashMap;
use crate::clap::symbols::HavenParameters;
use crate::commands;
use crate::common::symbols::{CoreHavenCommand, HavenFunction};

pub struct Dispatcher {
  pub command: Option<CoreHavenCommand>,
  pub args: HashMap<String, HavenParameters>
}

pub struct DispatcherResult<'a> {
  pub input: &'a Dispatcher,
  pub message: &'a str,
  pub success: bool,
}

impl Dispatcher {
  pub fn new(command: Option<CoreHavenCommand>, args: HashMap<String, HavenParameters>) -> Self {
    Self { command, args }
  }
  pub fn get_bool(&self, key: &str) -> Option<bool> {
    match self.args.get(key) {
      Some(HavenParameters::Bool(b)) => Some(*b),
      _ => None,
    }
  }

  /**
  * Executes the command based on the Dispatcher input.
  */
  pub fn execute(&self) -> DispatcherResult {
    prepare_command(self)(self)
  }
}

impl<'a> DispatcherResult<'a> {
  pub fn output(input: &'a Dispatcher, success: bool, message: &'a str) -> Self {
    Self { input, success, message }
  }
}

fn prepare_command(cmd: &Dispatcher) -> HavenFunction {
  match &cmd.command {
    Some(CoreHavenCommand::Init) => commands::init::run,
    Some(CoreHavenCommand::Pot(sub)) => match sub {
      crate::clap::symbols::PotSubCommands::Init { .. } => commands::pot::run,
      crate::clap::symbols::PotSubCommands::List => commands::pot_list::run,
      crate::clap::symbols::PotSubCommands::Status => commands::pot_status::run,
    },
    // Some(HavenCommand::Add) => println!("Add"),
    // Some(HavenCommand::Tag) => println!("Tag"),
    // Some(HavenCommand::Reference) => println!("Reference"),
    // Some(HavenCommand::Bloom) => println!("Bloom"),
    // Some(HavenCommand::Commit) => println!("Commit"),
    // Some(HavenCommand::Checkout) => println!("Checkout"),
    // Some(HavenCommand::Merge) => println!("Merge"),
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
    Some(CoreHavenCommand::NoCommand) => commands::no_command::run,
    _ => commands::no_command::run,
  }
}
