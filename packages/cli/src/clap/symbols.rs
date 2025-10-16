// use crate::common::symbols::{HavenCommand};
use clap::{Parser, Subcommand};

#[derive(Debug, Clone)]
pub enum HavenParameters {
  Bool(bool),
  String(String),
  Int(i64),
  Float(f64),
  List(Vec<HavenParameters>),
}

#[derive(Parser)]
#[command(
  name = "haven",
  about = "Rooted in security, cultivate your creativity, branch endless ideas and harvest innovation with Haven.\n\nUsage: haven [command] [options]\n\nRun 'haven help <command>' for more details."
)]
pub struct HavenCli {
  #[command(subcommand)]
  pub cmd: CliHavenCommand,
}

#[derive(Debug, Subcommand)]
pub enum CliHavenCommand {
  /// Manage your local pot
  Pot {
    #[command(subcommand)]
    command: PotSubCommands,
  },

  /// Initialises a new Haven project
  Init {
    /// Path to initialise the project in
    #[arg(short, long)]
    path: Option<String>,

    /// Force initialisation
    #[arg(short, long, default_value_t = false)]
    force: bool,
  },
}

#[derive(Debug, Subcommand)]
pub enum PotSubCommands {
  /// Manage your local pot
  Init {
    #[arg(long, default_value = ".")]
    path: String
  },
  /// Show disk, peers, chunk health, estimated size
  Status,
  /// List all pots installed on this machine
  List
}
