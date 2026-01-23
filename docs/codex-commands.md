# codex-sync CLI Commands Reference

Complete reference for all codex-sync CLI commands.

## Overview

```bash
codex-sync <command> [options]
```

## Commands

### login

Configure OpenSync credentials.

```bash
codex-sync login
```

**Interactive prompts:**
- Convex URL (e.g., `https://your-project.convex.cloud`)
- API Key (starts with `osk_`)

**Example:**
```bash
$ codex-sync login

  OpenSync Login

Convex URL (e.g., https://your-project.convex.cloud): https://my-app.convex.cloud
API Key (starts with osk_): osk_abc123xyz789
✓ Credentials saved

ℹ Config saved to: /Users/you/.config/codex-sync/config.json

Next step: Run "codex-sync setup" to configure Codex CLI hooks
```

---

### logout

Clear stored credentials and optionally remove Codex CLI hook.

```bash
codex-sync logout
```

**Example:**
```bash
$ codex-sync logout

  OpenSync Logout

✓ Credentials cleared
Also remove Codex CLI hook? (y/N): y
✓ Codex CLI hook removed
```

---

### setup

Add the notify hook to Codex CLI configuration.

```bash
codex-sync setup
```

This adds the following to `~/.codex/config.toml`:

```toml
notify = ["codex-sync", "hook", "agent-turn-complete"]
```

**Example:**
```bash
$ codex-sync setup

  Codex CLI Setup

✓ Notify hook added to Codex CLI config

ℹ Config file: /Users/you/.codex/config.toml

Sessions will now sync automatically when Codex finishes a turn.
```

---

### verify

Verify all configuration and test connectivity.

```bash
codex-sync verify
```

**Checks performed:**
1. Credentials configured
2. Codex CLI hook installed
3. Connection to OpenSync backend
4. Sessions directory exists

**Example:**
```bash
$ codex-sync verify

  OpenSync Setup Verification

Credentials:
✓ Configured
   Convex URL: https://my-app.convex.cloud
   API Key: osk_****...****

Codex CLI Config:
✓ Hook configured
   Config file: /Users/you/.codex/config.toml
   Hook: codex-sync

Connection Test:
✓ Connected to OpenSync

Sessions Directory:
✓ Found 12 recent session(s)
   Directory: /Users/you/.codex/sessions

✓ Ready! Start Codex and sessions will sync automatically.
```

---

### synctest

Test connectivity and sync the most recent session.

```bash
codex-sync synctest
```

**Example:**
```bash
$ codex-sync synctest

  OpenSync Connection Test

Testing connection...
✓ Connection successful!

Looking for sessions to sync...
Found session: 7f9f9a2e-1b3c-4c7a
  Model: gpt-5-codex
  Messages: 8
  Tokens: 15432

✓ Session synced! ID: abc123
  Messages synced: 8
```

---

### sync

Manually sync sessions to OpenSync.

```bash
codex-sync sync [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `--all` | Sync all sessions (no limit) |
| `--limit N` | Sync last N sessions (default: 10) |

**Examples:**

```bash
# Sync last 10 sessions (default)
codex-sync sync

# Sync last 5 sessions
codex-sync sync --limit 5

# Sync all sessions
codex-sync sync --all
```

**Output:**
```bash
$ codex-sync sync --limit 3

  Sync Sessions

Found 3 session(s) to sync

✓ 7f9f9a2e... (8 messages)
✓ a3b4c5d6... (12 messages)
✓ e7f8g9h0... (5 messages)

Synced: 3, Failed: 0
```

---

### status

Show current connection status and configuration summary.

```bash
codex-sync status
```

**Example:**
```bash
$ codex-sync status

  OpenSync Status

Configuration:
  Config file: /Users/you/.config/codex-sync/config.json
  Convex URL: https://my-app.convex.cloud
  API Key: osk_****...****
  Auto-sync: enabled
  Sync tool calls: yes
  Debug mode: no

Codex CLI:
  Home: /Users/you/.codex
  Config: /Users/you/.codex/config.toml
  Sessions: /Users/you/.codex/sessions
  Hook configured: yes

Connection:
  Status: connected
```

---

### config

Show current configuration.

```bash
codex-sync config [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

**Examples:**

```bash
# Human-readable format
$ codex-sync config

  Current Configuration

convexUrl: https://my-app.convex.cloud
apiKey: osk_****...****
autoSync: true
syncToolCalls: true
syncThinking: false
debug: false

ℹ Config file: /Users/you/.config/codex-sync/config.json
```

```bash
# JSON format
$ codex-sync config --json
{
  "convexUrl": "https://my-app.convex.cloud",
  "apiKey": "osk_abc123xyz789",
  "autoSync": true,
  "syncToolCalls": true,
  "syncThinking": false,
  "debug": false
}
```

---

### set

Update a configuration value.

```bash
codex-sync set <key> <value>
```

**Valid keys:**

| Key | Type | Description |
|-----|------|-------------|
| `autoSync` | boolean | Enable automatic sync |
| `syncToolCalls` | boolean | Include tool call details |
| `syncThinking` | boolean | Include thinking traces |
| `debug` | boolean | Enable debug logging |
| `convexUrl` | string | Convex deployment URL |
| `apiKey` | string | OpenSync API key |

**Examples:**

```bash
# Enable debug mode
codex-sync set debug true

# Disable tool call syncing
codex-sync set syncToolCalls false

# Update API key
codex-sync set apiKey osk_new_key_here
```

**Output:**
```bash
$ codex-sync set debug true
✓ Set debug = true
```

---

### hook

Handle Codex CLI hook events (internal use).

```bash
codex-sync hook <event> [json-payload]
```

This command is called automatically by Codex CLI via the notify hook. You typically don't need to run it manually.

**Supported events:**
- `agent-turn-complete` - Triggered when Codex finishes a turn

**Example (internal):**
```bash
codex-sync hook agent-turn-complete '{"type":"agent-turn-complete","thread-id":"abc123"}'
```

---

### help

Show help information.

```bash
codex-sync help
codex-sync --help
codex-sync -h
```

---

### version

Show version number.

```bash
codex-sync version
codex-sync --version
codex-sync -v
```

**Output:**
```bash
$ codex-sync version
codex-sync v1.0.0
```

---

## Environment Variables

Configuration can also be set via environment variables:

| Variable | Description |
|----------|-------------|
| `CODEX_SYNC_CONVEX_URL` | Convex deployment URL |
| `CODEX_SYNC_API_KEY` | OpenSync API key |
| `CODEX_SYNC_AUTO_SYNC` | Enable auto-sync (`true`/`false`) |
| `CODEX_SYNC_TOOL_CALLS` | Sync tool calls (`true`/`false`) |
| `CODEX_SYNC_THINKING` | Sync thinking traces (`true`/`false`) |
| `CODEX_SYNC_DEBUG` | Enable debug mode (`true`/`false`) |

Environment variables take precedence over config file values.

**Example:**
```bash
export CODEX_SYNC_DEBUG=true
codex-sync sync
```

---

## Exit Codes

| Code | Description |
|------|-------------|
| 0 | Success |
| 1 | Error (configuration, connection, or command failure) |

---

## Troubleshooting

### Debug Mode

Enable debug mode to see detailed logging:

```bash
codex-sync set debug true
```

Debug logs are written to stderr.

### Common Issues

**"Not configured" error:**
```bash
codex-sync login
```

**"Hook not configured" warning:**
```bash
codex-sync setup
```

**Connection failures:**
```bash
# Check status
codex-sync status

# Test connection
codex-sync synctest

# Verify URL format (no trailing slash)
codex-sync set convexUrl https://your-project.convex.cloud
```

**Sessions not syncing:**
```bash
# Check hook is installed
cat ~/.codex/config.toml | grep notify

# Manual sync
codex-sync sync --limit 5

# Enable debug mode
codex-sync set debug true
```

### Full Reset

```bash
# Remove plugin
npm uninstall -g codex-sync

# Clear config
rm -rf ~/.config/codex-sync

# Reinstall
npm install -g codex-sync

# Reconfigure
codex-sync login
codex-sync setup
codex-sync verify
```

---

## See Also

- [README](../README.md) - Quick start guide
- [Setup Guide](setup-codex-sync.md) - Build and publish guide
- [Architecture](codex-sync-docs.md) - Technical documentation
