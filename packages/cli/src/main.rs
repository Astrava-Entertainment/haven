use haven_cli::{dispatcher, parser};

fn main() {
    let command = parser::germinate();
    dispatcher::execute(&command);
}

