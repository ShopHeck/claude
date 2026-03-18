# Good Example: Python Project with uv

**Trigger context:** User has `pyproject.toml` + `uv.lock` (modern Python setup).

## Hook: `.claude/hooks/session-start.sh`

```bash
#!/bin/bash
set -euo pipefail

cd "${CLAUDE_PROJECT_DIR:-.}"

if [ -f "uv.lock" ]; then
  uv sync                    # ✓ Reproducible: uses lock file
elif [ -f "requirements.txt" ]; then
  pip install --quiet -r requirements.txt
fi
```

## Registration: `.claude/settings.json`

```json
{
  "permissions": {
    "allow": [
      "Bash(uv sync)",
      "Bash(pip install:*)"
    ]
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

- Prefers `uv sync` (lock-file based) over bare `pip install` for reproducibility.
- Falls back to `requirements.txt` so the hook works on older projects in the same repo.
- `--quiet` reduces noise in session output without suppressing errors.
