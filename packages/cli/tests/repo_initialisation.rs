#[cfg(test)]
mod baseline_commands_tests {
  use haven_cli::common::symbols::CoreHavenCommand;
  use haven_cli::dispatcher::Dispatcher;
  use std::collections::HashMap;

  #[test]
  fn test_haven_init() {
    let dispatcher = Dispatcher::new(
      Some(CoreHavenCommand::Init),
      HashMap::new(),
    );
    let result = dispatcher.execute();

    assert_eq!(result.success, true);
    assert_eq!(
      result.message,
      "The Grove is Born! The Seed is Planted! The Garden is Ready!"
    );
  }

  #[test]
  fn test_haven_unknown_command() {
    let dispatcher = Dispatcher::new(
      Some(CoreHavenCommand::NoCommand),
      HashMap::new(),
    );
    let result = dispatcher.execute();

    assert_eq!(result.success, false);
    assert_eq!(
      result.message,
      "No command found. Try 'haven help' for a list of commands."
    );
  }
}
