# CLAUDE.md

This file provides guidance for AI assistants (Claude and others) working in this repository.

## Repository Overview

**Name:** claude
**Owner:** ShopHeck
**Description:** claude code creations — a repository for projects and experiments built with or assisted by Claude.

This is currently a **blank-slate repository** with no source code yet. The conventions below establish the foundation for how this project should be developed going forward.

---

## Repository Structure

```
claude/
├── CLAUDE.md       # This file — AI assistant guidance
└── README.md       # Project overview
```

As the project grows, structure should follow the conventions described below.

---

## Development Workflow

### Branches

- `main` / `master` — stable, production-ready code
- `claude/<description>-<id>` — feature branches created by Claude AI sessions

Always develop on the designated feature branch and open a pull request to merge into `main`.

### Git Conventions

- **Commit messages:** Use clear, imperative-style messages (e.g., `Add user authentication`, `Fix broken link in README`)
- **Branch naming:** `claude/<short-description>-<session-id>` for AI-assisted branches
- **Push:** Always use `git push -u origin <branch-name>`

### Typical Workflow

```bash
# 1. Ensure you are on the correct feature branch
git checkout claude/<description>-<id>

# 2. Make changes, then stage and commit
git add <files>
git commit -m "Descriptive commit message"

# 3. Push to remote
git push -u origin claude/<description>-<id>
```

---

## Adding New Projects

When adding a new project or significant feature to this repository:

1. **Create a subdirectory** with a clear, lowercase, hyphen-separated name (e.g., `my-project/`)
2. **Add a README.md** inside the subdirectory explaining what it does
3. **Include a `.gitignore`** appropriate for the language/framework used
4. **Document the tech stack** clearly in the subdirectory README

### Recommended Project Layout (example)

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

Since no language or framework has been chosen yet, these are general guidelines. Update this section as the stack is established.

### General

- Prefer **readable, self-documenting code** over clever one-liners
- Keep functions small and focused on a single responsibility
- Avoid premature abstraction — write the simplest code that works
- Do not add error handling, validation, or fallbacks for scenarios that cannot occur

### Naming

| Context | Convention |
|---|---|
| Files & directories | `lowercase-hyphenated` |
| Variables / functions | `camelCase` (JS/TS) or `snake_case` (Python) |
| Classes / types | `PascalCase` |
| Constants | `UPPER_SNAKE_CASE` |

### Comments

- Only add comments where the logic is not self-evident
- Prefer expressive naming over explanatory comments
- Do not add boilerplate JSDoc/docstrings unless the project style requires them

---

## Testing

No testing infrastructure exists yet. When tests are added:

- Co-locate test files with source (`foo.test.ts` next to `foo.ts`) **or** use a top-level `tests/` directory — pick one and be consistent
- Document the test command here once established (e.g., `npm test`, `pytest`)
- Tests must pass before merging to `main`

---

## AI Assistant Instructions

### Scope

- Only make changes that are directly requested or clearly necessary
- Do not refactor surrounding code, add extra features, or over-engineer solutions
- Do not create files unless they are required for the task

### Safety

- Never push to `main` or `master` directly
- Always work on the designated `claude/` branch
- Confirm with the user before taking irreversible actions (deleting files, force-pushing, etc.)
- Do not introduce security vulnerabilities (injection, XSS, hardcoded secrets, etc.)

### Commit & Push

- Commit with a clear, descriptive message after completing a task
- Push using: `git push -u origin <branch-name>`
- The branch name must match the pattern `claude/<description>-<id>` or the push will be rejected

---

## Updating This File

Keep this file current as the project evolves:

- Add the tech stack once chosen
- Add build/test/lint commands as they are established
- Add architecture notes when the project structure becomes non-trivial
- Document any non-obvious conventions or decisions as they arise
