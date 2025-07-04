mod parser;
mod dispatcher;
mod commands;
mod simulate_fuse;
mod config;
mod utils;
mod plugins;
mod webhooks;

fn main() {
    let command = parser::germinate();
    dispatcher::execute(command);
}