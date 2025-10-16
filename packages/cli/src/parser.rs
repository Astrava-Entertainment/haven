use crate::clap::symbols::CliHavenCommand;
use crate::clap::symbols::PotSubCommands;
use crate::clap::symbols::HavenParameters;
use std::collections::HashMap;
use crate::common::symbols::CoreHavenCommand;
use crate::dispatcher::{Dispatcher};

//* Map CLI commands to Core-Dispatcher commands
impl From<CliHavenCommand> for CoreHavenCommand {
  fn from(cli: CliHavenCommand) -> Self {
    match cli {
      CliHavenCommand::Init { .. } => CoreHavenCommand::Init,
      CliHavenCommand::Pot { command } => CoreHavenCommand::Pot(command),
    }
  }
}


pub fn clap_to_dispatcher(cmd: CliHavenCommand) -> Dispatcher {
  let mut args = HashMap::new();
  let core_cmd: CoreHavenCommand = cmd.into();

  match &core_cmd {
    CoreHavenCommand::Init => {
      // No Arguments
    },

    CoreHavenCommand::Pot(sub) => match sub {
      PotSubCommands::Init { path} => {
        args.insert("path".into(), HavenParameters::String(path.clone()));
      }
      PotSubCommands::Status => {
        // no args
      }
      PotSubCommands::List => {
        // no args
      }
    },
    _ => {}
  }

  Dispatcher {
    command: Some(core_cmd),
    args,
  }
}
