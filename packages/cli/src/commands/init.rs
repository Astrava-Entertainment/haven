use crate::commands::symbols::{Dispatcher, DispatcherResult};

pub fn run(cmd: &Dispatcher) -> DispatcherResult {
    let result = "The Grove is Born! The Seed is Planted! The Garden is Ready!";
    println!("{}", result);

    DispatcherResult::output(cmd, true, result)
}