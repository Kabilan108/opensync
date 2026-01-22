# Fix: Empty Assistant Messages on Sessions (v0.1.11)

We shipped claude-code-sync v0.1.11 to fix a bug where assistant messages weren't showing up in your OpenSync dashboard.

## What was happening

After upgrading to v0.1.10, some users reported:

- Assistant messages not appearing in session view (only tool calls were visible)
- Token counts showing as "0 tokens / $0.0000"
- Sessions stuck as "Untitled"

The OpenCode plugin worked fine. Only the Claude Code plugin had this issue.

## Why it happened

Claude Code hooks work differently than we expected.

When the `Stop` hook fires, Claude Code does NOT pass `response` or `token_usage` directly in the payload. Instead, it sends a `transcript_path` pointing to a JSONL file on disk.

**What we expected to receive:**

```json
{
  "session_id": "abc123",
  "response": "Done. I added the feature...",
  "token_usage": { "input": 500, "output": 100 }
}
```

**What Claude Code actually sends:**

```json
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../abc123.jsonl"
}
```

The actual conversation data lives in that transcript file, not in the hook payload.

## How we fixed it

We updated the plugin to read and parse the transcript file directly.

1. **New `parseTranscriptFile()` function** reads the JSONL transcript and extracts:
   - Assistant message text from `type: "assistant"` entries
   - Token usage from `message.usage` fields
   - Model information from each message

2. **Updated Stop handler** now:
   - Reads `transcript_path` from the hook data
   - Parses the JSONL to find assistant messages
   - Deduplicates messages using UUID tracking
   - Syncs extracted messages to OpenSync
   - Updates session with total token usage

## Upgrade instructions

```bash
npm update -g claude-code-sync
```

Verify:

```bash
claude-code-sync --version
```

Should show `0.1.11` or later.

## Testing the fix

Start a new Claude Code session and check your OpenSync dashboard for:

- Assistant text responses (not just tool calls)
- Actual token counts
- Session titles generated from your first prompt

## The takeaway

Claude Code hooks give you a `transcript_path` to a JSONL file containing the full conversation history. Unlike some other plugin systems that pass data directly, Claude Code requires reading and parsing this file to extract messages and token usage.

If you're building integrations with Claude Code hooks, keep this in mind.

---

Thanks to @p4cs-974 for reporting this issue. Let us know in the comments if you see any other issues after upgrading.
