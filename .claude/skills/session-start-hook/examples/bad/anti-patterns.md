# Anti-Patterns

## 1 — No error guard (`set -e` missing)

```bash
#!/bin/bash
# ✗ Missing set -euo pipefail

npm install   # fails silently if npm isn't installed
echo "done"   # always prints "done" even when install failed
```

**Problem:** Claude sees exit code 0 and assumes setup succeeded. Tests will fail with cryptic "module not found" errors.

**Fix:** Add `set -euo pipefail` as the first real line.

---

## 2 — Running tests in the hook

```bash
#!/bin/bash
set -euo pipefail

npm install
npm test      # ✗ Tests run on EVERY session start/resume/clear
```

**Problem:** Tests run on every `/clear`, resume, and session restart — not just when the user wants them. Slow tests block session startup. Failing tests block the session entirely.

**Fix:** Remove `npm test`. Tests belong in a separate tool call, not the setup hook.

---

## 3 — Hardcoded paths

```bash
#!/bin/bash
set -euo pipefail

cd /home/ubuntu/myproject   # ✗ Breaks everywhere except that machine
npm install
```

**Problem:** Path is wrong in every environment other than the author's machine.

**Fix:** Use `cd "${CLAUDE_PROJECT_DIR:-.}"` which resolves to the repository root in any environment.

---

## 4 — Skipping the existence check

```bash
#!/bin/bash
set -euo pipefail

npm install   # ✗ Fails with "no package.json" on non-JS repos
```

**Problem:** Repos that don't use npm will error on every session start.

**Fix:**
```bash
if [ -f "package.json" ]; then
  npm install
fi
```

---

## 5 — Using `npm ci` instead of `npm install`

```bash
#!/bin/bash
set -euo pipefail

cd "${CLAUDE_PROJECT_DIR:-.}"

if [ -f "package.json" ]; then
  npm ci   # ✗ Deletes and rebuilds node_modules from scratch every session
fi
```

**Problem:** `npm ci` wipes `node_modules` before installing. The hook environment is cached after it completes, so `node_modules` persists across sessions. `npm ci` throws that cache away on every session start, making restarts significantly slower.

**Fix:** Use `npm install` — it reuses the cached `node_modules` and only fetches what changed.
