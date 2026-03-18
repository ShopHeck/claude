---
name: startup-hook-skill
description: Creating and developing startup hooks for Claude Code on the web. Use when the user wants to set up a repository for Claude Code on the web, create a SessionStart hook to ensure their project can run tests and linters during web sessions.
---

# Startup Hook Skill for Claude Code on the web

Create SessionStart hooks that install dependencies so tests and linters work in Claude Code on the web sessions.

## Reference material

Before working, load the following documents:

- **Hook mechanics** (input schema, async mode, env vars): `instructions/hook-mechanics.md`
- **Dependency recognition** (package manager lookup table + detection shell function): `instructions/dependency-recognition.md`
- **Design principles** (idempotent, fail-fast, scoped, guarded, minimal permissions): `instructions/hook-design-principles.md`
- **Template — hook script**: `templates/session-start.sh`
- **Template — settings registration**: `templates/settings-registration.md`
- **Good examples**: `examples/good/npm-basic.md`, `examples/good/python-uv.md`
- **Anti-patterns to avoid**: `examples/bad/anti-patterns.md`

---

## Workflow

Make a todo list for all tasks below and work through them one at a time.

### 1. Analyze Dependencies

Read `instructions/dependency-recognition.md`, then scan the repo for manifest and lock files. Also read any README or setup documentation for additional context on environment setup.

### 2. Design Hook

Using `instructions/hook-design-principles.md` as the quality bar and `templates/session-start.sh` as the starting point, draft a hook script:

- Default to synchronous mode (do **not** use `async` in the first iteration unless the user requests it)
- Scope the hook to the web environment using `$CLAUDE_CODE_REMOTE` unless the user asks otherwise
- Prefer install methods that benefit from container caching — use `npm install` rather than `npm ci` (ci wipes `node_modules` on every run; install reuses the cached state)

### 3. Create Hook File

```bash
mkdir -p .claude/hooks
# write hook to .claude/hooks/session-start.sh
chmod +x .claude/hooks/session-start.sh
```

### 4. Register in Settings

Follow `templates/settings-registration.md` to add the hook to `.claude/settings.json`. If the file already exists, merge the `hooks` key rather than overwriting.

Use `$CLAUDE_PROJECT_DIR/.claude/hooks/session-start.sh` as the command path:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/session-start.sh"
          }
        ]
      }
    ]
  }
}
```

### 5. Validate Hook

Run the hook directly:

```bash
CLAUDE_CODE_REMOTE=true ./.claude/hooks/session-start.sh
```

**IMPORTANT:** Verify dependencies are installed and the script exits 0.

### 6. Validate Linter

Find the correct lint command and run it on one example file. If it fails, update the hook and re-test.

### 7. Validate Tests

Find the correct test command and run one test. No need to run the full suite. If it fails, update the hook and re-test.

### 8. Commit and Push

Commit `.claude/hooks/session-start.sh` and `.claude/settings.json` with a clear message, then push to the remote branch.

---

## Wrap Up

Provide a summary to the user:

* Summary of the changes made
* Validation results:
  1. ✅/‼️ Session hook execution (details if failed)
  2. ✅/‼️ Linter execution (details if failed)
  3. ✅/‼️ Test execution (details if failed)
* Hook execution mode: **Synchronous**
  * Inform the user of the trade-offs and offer to switch to async if they prefer faster session startup:
    * Pros: Guarantees dependencies are ready before the session starts — no race conditions
    * Cons: The remote session won't start until the hook completes
* Inform the user that once the hook is merged to the repo's default branch, all future sessions will use it.
