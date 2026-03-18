# Good Example: Basic npm Project

**Trigger context:** User has `package.json` with no lock file yet (new repo).

## Hook: `.claude/hooks/session-start.sh`

```bash
#!/bin/bash
set -euo pipefail            # ✓ Fail-fast

cd "${CLAUDE_PROJECT_DIR:-.}"

if [ -f "package.json" ]; then
  npm install                # ✓ Idempotent — npm install is safe to re-run
fi
```

## Registration: `.claude/settings.json`

```json
{
  "permissions": {
    "allow": ["Bash(npm install)"]
  },
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/session-start.sh"
          }
        ]
      }
    ]
  }
}
```

## Why this is good

- Uses `set -euo pipefail` so any failure is surfaced immediately.
- Guards on `package.json` existence before running npm — works even if the user deletes the file.
- Permission is pre-approved to avoid an interactive prompt on each session start.
- Hook only installs; it doesn't run tests, lint, or modify source files.
