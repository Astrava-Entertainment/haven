use crate::commands::symbols::{Dispatcher, HavenCommand};
use clap::{Arg, Command};

/**
 * Creates a command directly from within the program.
 * This function is used to create a Dispatcher object from a command line argument.
 * It is useful for testing or when you want to run a command without using the full
 * command line parser.
 *
 * # Arguments
 * - `command`: A string slice that holds the command to be executed.
 *
 * # Returns
 * A Dispatcher object containing the parsed command and its arguments.
 */
pub fn germinate_command_directly(command: &str) -> Dispatcher {
    let haven_command = get_haven_command(command);

    Dispatcher::new(haven_command, command.to_string())
}

/**
 * Creates the command line parser and matches it against haven's commands.
 *
 * This function uses the clap library to parse the command line arguments before detecting
 * the HavenCommand it needs to go to.
 *
 * # Returns
 * A Dispatcher object containing the parsed command and its arguments.
 */
pub fn germinate() -> Dispatcher {
    let matches = Command::new("haven")
        .about("Rooted in security, cultivate your creativity, branch endless ideas and harvest innovation with Haven. \n Usage: haven [command] [options] \n Run haven help <command> for more details.")
        .arg(Arg::new("command")
            .required(true)
            .help("The command to run"))
        .get_matches();

    let first_match = matches.get_one::<String>("command").unwrap().to_string();
    let command = get_haven_command(&first_match);

    Dispatcher::new(command, first_match)
}

/**
 * Matches the input string to the corresponding HavenCommand enum.
 * # Returns
 * An Option<HavenCommand> that contains the matched command if found, or None if not.
*/
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
