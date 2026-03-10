# CLAUDE.md

> Guidance for AI assistants working in this repo. Keep this file current as the project evolves.

---

## AI Assistant Instructions

### Scope
- Only make changes that are directly requested or clearly necessary
- Do not refactor surrounding code, add extra features, or over-engineer solutions
- Do not create files unless required for the task

### Safety
- **Never push to `main` directly** — always work on a `claude/` feature branch
- Confirm with the user before irreversible actions (deleting files, force-pushing, etc.)
- Do not introduce security vulnerabilities (injection, XSS, hardcoded secrets, etc.)

### Commit & Push
- Commit with a clear, imperative-style message after completing a task
- Push using: `git push -u origin <branch-name>`
- Branch name must match `claude/<description>-<id>` or the push will be rejected

---

## Repository Overview

**Owner:** ShopHeck
**Description:** claude code creations — projects and experiments built with or assisted by Claude.

Currently a blank-slate repository. As projects are added, update this file with the relevant tech stack, build commands, and architecture notes.

```
claude/
├── CLAUDE.md       # AI assistant guidance (this file)
└── README.md       # Project overview
```

---

## Development Workflow

### Branches
- `main` — stable, production-ready code (default branch)
- `claude/<description>-<id>` — feature branches for AI-assisted sessions

### Workflow

```bash
# 1. Switch to the designated feature branch
git checkout claude/<description>-<id>

# 2. Make changes, stage, and commit
git add <files>
git commit -m "Add feature X"

# 3. Push and open a PR
git push -u origin claude/<description>-<id>
gh pr create --base main --title "..." --body "..."
```

---

## Adding New Projects

1. Create a subdirectory with a lowercase, hyphen-separated name (e.g., `my-project/`)
2. Add a `README.md` describing what it does and its tech stack
3. Include a `.gitignore` appropriate for the language/framework

```
claude/
├── CLAUDE.md
├── README.md
└── my-project/
    ├── README.md
    ├── .gitignore
    ├── src/
    └── tests/
```

---

## Code Conventions

### General
- Prefer readable, self-documenting code over clever one-liners
- Keep functions small and focused on a single responsibility
- Avoid premature abstraction — write the simplest code that works
- Do not add error handling or fallbacks for scenarios that cannot occur

### Naming

| Context | Convention |
|---|---|
| Files & directories | `lowercase-hyphenated` |
| Variables / functions | `camelCase` (JS/TS) or `snake_case` (Python) |
| Classes / types | `PascalCase` |
| Constants | `UPPER_SNAKE_CASE` |

### Comments
- Only comment where logic is not self-evident
- Prefer expressive naming over explanatory comments
- Do not add boilerplate JSDoc/docstrings unless the project style requires them

---

## Testing

No testing infrastructure yet. When added:
- Co-locate test files with source (`foo.test.ts`) or use a top-level `tests/` directory — pick one and be consistent
- Document the test command here (e.g., `npm test`, `pytest`)
- Tests must pass before merging to `main`
