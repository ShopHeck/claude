# Registering the Hook in settings.json

Add the `hooks` key to `.claude/settings.json` in the repository root. If the file does not exist, create it.

## Minimal example

```json
{
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

## With permissions

If the hook needs to run commands that Claude Code would normally prompt for (npm, pip, etc.), pre-approve them in the same file:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm install:*)",
      "Bash(pip install:*)",
      "Bash(bundle install)"
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

## Placement

| File | Scope |
|---|---|
| `.claude/settings.json` | Project — committed, shared with team |
| `~/.claude/settings.json` | User — local machine only |
| `~/.claude/settings.local.json` | User local override — highest priority |
