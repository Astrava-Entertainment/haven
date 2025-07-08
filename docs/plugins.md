# Plugin Architecture

Plugins are small Rust programs stored in `packages/cli/plugins`. They are listed in `plugins.json` at the repository root. The CLI checks this file when a command is unknown. If a match is found, the plugin source is compiled on the fly using `rustc` and executed.

Plugins can react to internal events. After `commit` or `push` commands succeed, every registered plugin is executed with the environment variable `HAVEN_EVENT` set to the event name (`onCommit` or `onPush`). This allows plugins to perform additional tasks like generating reports or syncing files.

Webhook endpoints defined in `webhooks.json` receive the same event information via HTTP POST requests. This makes it easy to integrate Haven with services like Discord or Jira.

