# Hook Design Principles

## 1 — Idempotent

The hook can run multiple times without side effects. Installing already-installed packages, creating already-existing directories, or setting already-set env vars must not fail or produce duplicate state.

Bad:
```bash
mkdir /tmp/workdir     # fails on second run
```
Good:
```bash
mkdir -p /tmp/workdir  # no-op if already exists
```

---

## 2 — Fail-fast, noisy on error

Use `set -euo pipefail` at the top. A silent failure (hook exits 0 but work wasn't done) is worse than a loud failure. Claude receives the exit code and stdout/stderr — surface errors clearly.

```bash
#!/bin/bash
set -euo pipefail
```

---

## 3 — Scoped to session setup

Hooks run at every session start, resume, and /clear. They must only perform **environment preparation** — installing deps, restoring caches, writing env vars. They must never run tests, generate code, or perform actions with side effects on the codebase.

---

## 4 — Dependency checks before install

Guard install commands behind existence checks to avoid redundant network calls:

```bash
if [ ! -d node_modules ]; then
  npm install
fi
```

For language-level managers that support it, prefer `--frozen-lockfile` / `--ci` to ensure reproducible installs.

---

## 5 — Minimal permissions

The hook runs with the same permissions as the Claude Code session. Request only what is needed. Avoid `sudo` unless the user's environment requires it and they have explicitly requested it.
