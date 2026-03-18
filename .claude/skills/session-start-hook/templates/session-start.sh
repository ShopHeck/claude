#!/bin/bash
# .claude/hooks/session-start.sh
# SessionStart hook — installs project dependencies at the start of each session.
# Replace the INSTALL_COMMAND block below with the one for your stack.
set -euo pipefail

cd "${CLAUDE_PROJECT_DIR:-.}"

# ── npm / Yarn / pnpm ────────────────────────────────────────────────────────
if [ -f "package.json" ]; then
  if [ -f "yarn.lock" ]; then
    yarn install --frozen-lockfile
  elif [ -f "pnpm-lock.yaml" ]; then
    pnpm install --frozen-lockfile
  else
    npm install  # prefer install over ci — reuses cached node_modules across sessions
  fi
fi

# ── Python ───────────────────────────────────────────────────────────────────
if [ -f "uv.lock" ]; then
  uv sync
elif [ -f "requirements.txt" ]; then
  pip install --quiet -r requirements.txt
elif [ -f "pyproject.toml" ]; then
  pip install --quiet -e .
fi

# ── Ruby ─────────────────────────────────────────────────────────────────────
if [ -f "Gemfile" ]; then
  bundle install
fi

# ── Go ───────────────────────────────────────────────────────────────────────
if [ -f "go.mod" ]; then
  go mod download
fi

# ── Rust ─────────────────────────────────────────────────────────────────────
if [ -f "Cargo.toml" ]; then
  cargo fetch
fi
