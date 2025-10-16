use haven_cli::dispatcher::{Dispatcher, DispatcherResult};
use chrono::Utc;
use haven_cli::{parser};
use haven_cli::clap::symbols::HavenCli;
use haven_cli::logger::log_raw::{log_audit};
use haven_cli::logger::symbols::AuditLogEntry;
use clap::Parser;

fn main() {
    let raw_args: Vec<String> = std::env::args().collect();
    let raw_input : String = raw_args[1..].join(" ");
    let cli: HavenCli = HavenCli::parse_from(&raw_args);
    let dispatcher: Dispatcher = parser::clap_to_dispatcher(cli.cmd);
    let result: DispatcherResult = dispatcher.execute();
    let audit_entry = AuditLogEntry {
        timestamp: Utc::now().to_rfc3339(),
        raw_input: raw_input.clone(),
        command: format!("{:?}", dispatcher.command),
        success: result.success,
        message: result.message.to_string(),
    };

    //* Log all input on demand
    if let Err(err) = log_audit(&audit_entry) {
        eprintln!("Failed to log audit entry: {}", err);
    }
}
