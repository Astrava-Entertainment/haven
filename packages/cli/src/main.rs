mod plugin_manager;
mod webhooks;
mod parser;
mod dispatcher;
mod commands;

fn main() {
    let command = parser::germinate();
    dispatcher::execute(command);
}

