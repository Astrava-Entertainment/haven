use crate::dispatcher::{Dispatcher, DispatcherResult};

pub fn run(cmd: &Dispatcher) -> DispatcherResult {
    println!("No command found. Try 'haven help' for a list of commands.");
    DispatcherResult::output(cmd, false, "No command found. Try 'haven help' for a list of commands.")
}