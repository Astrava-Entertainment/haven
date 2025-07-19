use haven_cli::{dispatcher, parser};

#[test]
fn test_haven_init(){
    let the_dispatcher = parser::germinate_command_directly("init");
    let result = dispatcher::execute(&the_dispatcher);

    
    assert_eq!(result.success, true);
    assert_eq!(result.message, "The Grove is Born! The Seed is Planted! The Garden is Ready!");
}

