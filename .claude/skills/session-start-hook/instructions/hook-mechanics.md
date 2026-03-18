# Hook Mechanics Reference

## Input (via stdin)

Claude Code passes this JSON to every hook at startup:

```json
{
  "session_id": "abc123",
  "source": "startup|resume|clear|compact",
  "transcript_path": "/path/to/transcript.jsonl",
  "permission_mode": "default",
  "hook_event_name": "SessionStart",
  "cwd": "/workspace/repo"
}
```

## Async Mode

Output `{"async": true, "asyncTimeout": 300000}` on the first line to run in the background while the session starts.

```bash
#!/bin/bash
set -euo pipefail

echo '{"async": true, "asyncTimeout": 300000}'

npm install  # runs in background
```

**Trade-off:** Async reduces session startup latency but introduces a race condition — Claude may try to run tests or linters before the hook finishes installing dependencies. Do not use async on the first iteration unless the user explicitly requests it.

## Environment Variables

| Variable | Purpose |
|---|---|
| `$CLAUDE_PROJECT_DIR` | Repository root path |
| `$CLAUDE_ENV_FILE` | Path to write variables that persist for the session |
| `$CLAUDE_CODE_REMOTE` | Set to `"true"` when running in Claude Code on the web |

### Persisting session variables

```bash
echo 'export PYTHONPATH="."' >> "$CLAUDE_ENV_FILE"
```

### Web-only guard

```bash
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi
```
