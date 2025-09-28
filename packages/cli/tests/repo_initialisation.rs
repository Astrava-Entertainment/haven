use haven_cli::{dispatcher, parser};

#[cfg(test)]
mod baseline_commands_tests {
    use super::*;

    #[test]
    fn test_haven_init(){
        
        let the_dispatcher = parser::germinate_command_directly("init");
        let result = dispatcher::execute(&the_dispatcher);
        
        assert_eq!(result.success, true);
        assert_eq!(result.message, "The Grove is Born! The Seed is Planted! The Garden is Ready!");
    }

    #[test]
    fn test_haven_unknown_command(){
        let the_dispatcher = parser::germinate_command_directly("unknown");
        let result = dispatcher::execute(&the_dispatcher);

        assert_eq!(result.success, false);
        assert_eq!(result.message, "No command found. Try 'haven help' for a list of commands.");
    }
}
