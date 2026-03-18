# Hook Output Checklist

Use this checklist to verify a generated hook before presenting it to the user. Every item must pass.

## Script quality

- [ ] First line is `#!/bin/bash`
- [ ] Second non-comment line is `set -euo pipefail`
- [ ] `cd "${CLAUDE_PROJECT_DIR:-.}"` is present before any file operations
- [ ] Every install command is guarded by an existence check (`[ -f ... ]` or `[ -d ... ]`)
- [ ] No `sudo` unless the user explicitly requested it
- [ ] No interactive prompts or `read` calls
- [ ] No test/lint commands inside the hook

## Web scoping

- [ ] Script is wrapped in `if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then exit 0; fi` **unless** the user asked for a non-remote hook

## Async mode

- [ ] `echo '{"async": ...}'` is **absent** in the first iteration (sync is the default)
- [ ] If async was requested by the user, the JSON line is the very first output line

## Correctness

- [ ] Package manager was detected using the lock-file-first order from `dependency-recognition.md`
- [ ] The right install command is used for the detected manager (see lookup table)
- [ ] No manifest file is assumed present without a file-existence guard

## Registration

- [ ] `.claude/settings.json` contains the `hooks.SessionStart` key
- [ ] The command path uses `$CLAUDE_PROJECT_DIR/.claude/hooks/session-start.sh`
- [ ] If the file pre-existed, the hooks key was merged, not overwritten

## Validation

- [ ] Hook was executed with `CLAUDE_CODE_REMOTE=true` and exited 0
- [ ] Linter ran successfully on at least one file
- [ ] At least one test passed
