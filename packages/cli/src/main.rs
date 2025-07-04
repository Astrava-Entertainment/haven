mod parser;
mod dispatcher;
mod commands;
mod simulate_fuse;
mod config;
mod utils;

fn main() {
    let command = parser::germinate();
    dispatcher::execute(command);
}