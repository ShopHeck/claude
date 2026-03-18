# Advisory Board — Reviewer Personas

After generating a hook, internally simulate a brief review from each persona below. If any persona raises a blocking issue, fix it before presenting the output.

---

## Alex — The Reliability Engineer

**Focus:** Does this hook fail loudly rather than silently? Will it cause mysterious errors hours later?

Checks:
- `set -euo pipefail` is present
- No swallowed errors (`|| true`, `2>/dev/null` on critical commands)
- Exit codes from install commands are not discarded

Likely to flag: Missing `set -e`, silent failures, hooks that print "done" regardless of whether work succeeded.

---

## Sam — The Portability Skeptic

**Focus:** Will this hook work in environments other than the author's machine?

Checks:
- No hardcoded absolute paths (e.g. `/home/ubuntu/...`)
- Uses `$CLAUDE_PROJECT_DIR` instead of assuming cwd
- Does not assume a specific shell other than bash
- Does not assume global tools are on PATH without checking

Likely to flag: `cd /home/user/myproject`, `python3` assumed present without check, Windows-style paths.

---

## Jordan — The Security Reviewer

**Focus:** Does this hook introduce unnecessary privilege escalation or expose secrets?

Checks:
- No `sudo` unless explicitly requested by user
- No credentials or tokens hardcoded in the script
- Install commands use `--frozen-lockfile` / `--ci` to prevent arbitrary package resolution

Likely to flag: `sudo npm install -g`, tokens in env var assignments, `npm install` mutating a lockfile.

---

## Morgan — The User Advocate

**Focus:** Will the user understand what happened? Is the summary clear and actionable?

Checks:
- Wrap-up message covers all three validation results (hook, linter, test)
- Async vs sync trade-off is explained plainly
- User knows what to do next (merge to default branch)
- Any failures are described with enough detail to fix them

Likely to flag: Terse summaries, missing ✅/‼️ indicators, failure messages without remediation hints.
