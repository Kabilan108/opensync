# codex-sync Architecture Documentation

Technical documentation for the codex-sync plugin architecture, data flow, and implementation details.

## Overview

codex-sync is an npm package that syncs OpenAI Codex CLI sessions to an OpenSync backend. It uses Codex CLI's `notify` hook system to trigger sync events and parses JSONL session files to extract complete session data.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           User's Machine                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐         ┌──────────────────────────────────────┐  │
│  │  Codex CLI   │         │            codex-sync                 │  │
│  │              │         │                                       │  │
│  │  Terminal UI │────────▶│  notify hook                          │  │
│  │              │   JSON  │       │                               │  │
│  └──────────────┘         │       ▼                               │  │
│         │                 │  ┌─────────────────┐                  │  │
│         │ writes          │  │  Hook Handler   │                  │  │
│         ▼                 │  │  (hook.ts)      │                  │  │
│  ┌──────────────┐         │  └────────┬────────┘                  │  │
│  │ ~/.codex/    │         │           │                           │  │
│  │  sessions/   │◀────────│───────────┘                           │  │
│  │  YYYY/MM/DD/ │  reads  │           │                           │  │
│  │  rollout-*.  │         │           ▼                           │  │
│  │   jsonl      │         │  ┌─────────────────┐                  │  │
│  └──────────────┘         │  │ Session Parser  │                  │  │
│                           │  │ (parser.ts)     │                  │  │
│                           │  └────────┬────────┘                  │  │
│                           │           │                           │  │
│                           │           ▼                           │  │
│                           │  ┌─────────────────┐                  │  │
│                           │  │ OpenSync Client │                  │  │
│                           │  │ (client.ts)     │                  │  │
│                           │  └────────┬────────┘                  │  │
│                           │           │                           │  │
│                           └───────────┼───────────────────────────┘  │
│                                       │                              │
└───────────────────────────────────────┼──────────────────────────────┘
                                        │ HTTPS
                                        ▼
                              ┌─────────────────────┐
                              │   OpenSync Backend   │
                              │      (Convex)        │
                              │                      │
                              │  POST /sync/session  │
                              │  POST /sync/message  │
                              │  POST /sync/batch    │
                              └─────────────────────┘
```

## Data Flow

### 1. Session Creation

When a user runs Codex CLI:

1. Codex creates a new session file in `~/.codex/sessions/YYYY/MM/DD/`
2. Session metadata is written as the first JSONL line
3. Events are appended as subsequent lines

### 2. Hook Trigger

When Codex completes a turn (agent-turn-complete):

1. Codex invokes: `codex-sync hook agent-turn-complete '{"type":"agent-turn-complete",...}'`
2. The hook handler receives the JSON payload
3. The handler extracts the session ID (thread-id)

### 3. Session Parsing

The parser reads the JSONL file:

1. Locates the session file by ID or uses most recent
2. Parses each JSONL line into typed RolloutItems
3. Extracts messages, tool calls, and token usage
4. Calculates cost based on model pricing

### 4. Sync to OpenSync

The client sends data to OpenSync:

1. Creates/updates session with metadata
2. Syncs each message to the session
3. Returns session ID and message count

## File Formats

### Codex Session File (JSONL)

Location: `~/.codex/sessions/YYYY/MM/DD/rollout-<timestamp>-<session-id>.jsonl`

**Line 1: Session Metadata**
```json
{
  "type": "session_meta",
  "payload": {
    "id": "7f9f9a2e-1b3c-4c7a-9b0e-...",
    "source": "cli",
    "timestamp": "2025-01-22T14:30:00.000Z",
    "model_provider": "openai",
    "model": "gpt-5-codex",
    "cwd": "/path/to/project"
  }
}
```

**Line 2+: Events**

User Message:
```json
{
  "type": "event_msg",
  "timestamp": "2025-01-22T14:30:05.000Z",
  "payload": {
    "type": "user_message",
    "content": "Fix the bug in main.ts"
  }
}
```

Assistant Response:
```json
{
  "type": "response_item",
  "timestamp": "2025-01-22T14:30:10.000Z",
  "payload": {
    "type": "Message",
    "role": "assistant",
    "content": [
      { "type": "OutputText", "text": "I'll fix that bug..." }
    ]
  }
}
```

Tool Call:
```json
{
  "type": "response_item",
  "timestamp": "2025-01-22T14:30:15.000Z",
  "payload": {
    "type": "FunctionCall",
    "name": "shell",
    "arguments": "{\"command\": \"cat main.ts\"}",
    "call_id": "call_123"
  }
}
```

Token Count:
```json
{
  "type": "event_msg",
  "timestamp": "2025-01-22T14:30:20.000Z",
  "payload": {
    "type": "token_count",
    "info": {
      "total_token_usage": {
        "input_tokens": 5000,
        "cached_input_tokens": 4000,
        "output_tokens": 500,
        "reasoning_output_tokens": 100,
        "total_tokens": 5500
      },
      "model_context_window": 272000
    }
  }
}
```

### Plugin Config File

Location: `~/.config/codex-sync/config.json`

```json
{
  "convexUrl": "https://your-project.convex.cloud",
  "apiKey": "osk_your_api_key",
  "autoSync": true,
  "syncToolCalls": true,
  "syncThinking": false,
  "debug": false,
  "lastSyncedSession": "7f9f9a2e-1b3c-4c7a-9b0e-..."
}
```

### Codex CLI Config

Location: `~/.codex/config.toml`

```toml
# Added by codex-sync setup
notify = ["codex-sync", "hook", "agent-turn-complete"]

# Other Codex settings
model = "gpt-5-codex"
approval_policy = "auto"
```

## Module Descriptions

### config.ts

Manages plugin configuration:

- `loadConfig()` - Load config from file and environment
- `saveConfig()` - Persist config changes
- `clearConfig()` - Remove config file
- `isConfigured()` - Check if credentials are set
- `getCodexHome()` - Get Codex CLI home directory
- `getCodexSessionsDir()` - Get sessions directory path

### parser.ts

Parses Codex session JSONL files:

- `parseSessionFile(path)` - Parse a single session file
- `findSessionFiles(options)` - Find session files with filtering
- `findSessionById(id)` - Locate session by ID
- `getMostRecentSession()` - Get most recent session file

### client.ts

OpenSync API client:

- `testConnection()` - Test backend connectivity
- `syncSession(data)` - Create/update a session
- `syncMessage(data)` - Add message to session
- `syncBatch(data)` - Batch sync
- `syncFullSession(session)` - Sync parsed session with messages
- `calculateCost(model, tokens)` - Calculate cost from usage

### hook.ts

Codex notify hook handler:

- `handleHook(event, payload)` - Process hook invocation
- Called silently, fails gracefully
- Triggers full session sync on agent-turn-complete

### toml.ts

TOML config file utilities:

- `parseTOML(content)` - Parse TOML content
- `addNotifyHook(path)` - Add codex-sync hook to config
- `isNotifyHookConfigured(path)` - Check if hook exists
- `removeNotifyHook(path)` - Remove hook from config

### cli.ts

CLI commands implementation:

- login, logout - Credential management
- setup - Configure Codex CLI hook
- verify - Validate setup
- sync, synctest - Manual sync operations
- status, config - View configuration
- hook - Internal hook handler entry point

## Cost Calculation

Token costs are calculated using model-specific pricing:

| Model | Input (per 1M) | Cached | Output (per 1M) |
|-------|---------------|--------|-----------------|
| gpt-5-codex | $2.50 | $0.62 | $10.00 |
| gpt-5 | $2.50 | $0.62 | $10.00 |
| gpt-5-pro | $5.00 | $1.25 | $20.00 |
| gpt-4.1 | $2.00 | $0.50 | $8.00 |

Formula:
```
cost = (input - cached) * input_rate 
     + cached * cached_rate 
     + output * output_rate
```

## Error Handling

The plugin is designed to fail silently when invoked as a hook to avoid disrupting the Codex CLI experience:

1. **Hook errors** - Logged to stderr if debug mode is enabled, otherwise silent
2. **API errors** - Returned as error responses, not thrown
3. **Parse errors** - Individual malformed lines are skipped
4. **Config errors** - Graceful fallback to defaults

## Security Considerations

1. **API keys** - Stored in user config directory with standard permissions
2. **Session data** - Sent over HTTPS to user's own Convex deployment
3. **No telemetry** - Plugin does not send data anywhere except configured backend
4. **Minimal permissions** - Only reads session files, writes config file

## Comparison with Claude Code Sync

| Feature | codex-sync | claude-code-sync |
|---------|-----------|------------------|
| Hook system | notify (single event) | Full lifecycle hooks |
| Config format | TOML | JSON |
| Events | agent-turn-complete | SessionStart, SessionEnd, UserPromptSubmit, PostToolUse, Stop |
| Token tracking | Cumulative per-turn | Per-message |
| Session storage | `~/.codex/sessions/` | `~/.claude/sessions/` |
| File format | JSONL | JSONL |

## Future Enhancements

1. **More hook events** - When Codex CLI adds more notify events
2. **Incremental sync** - Track last sync position to avoid re-syncing
3. **Offline queue** - Queue syncs when offline, retry later
4. **File watcher** - Alternative to hook-based sync
5. **Session resume tracking** - Handle resumed sessions correctly
