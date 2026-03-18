# Dependency Recognition

## Package Manager Lookup Table

| File present in repo root | Package manager | Install command |
|---|---|---|
| `package.json` | npm (default) | `npm install` |
| `package.json` + `yarn.lock` | Yarn | `yarn install` |
| `package.json` + `pnpm-lock.yaml` | pnpm | `pnpm install` |
| `requirements.txt` | pip | `pip install -r requirements.txt` |
| `pyproject.toml` + `uv.lock` | uv | `uv sync` |
| `pyproject.toml` (no lock) | poetry / pip | `pip install -e .` |
| `Gemfile` | Bundler | `bundle install` |
| `go.mod` | Go modules | `go mod download` |
| `Cargo.toml` | Cargo | `cargo fetch` |
| `composer.json` | Composer | `composer install` |
| `mix.exs` | Mix | `mix deps.get` |

## Detection Pattern

Always check for the lock file first — it disambiguates managers that share a manifest (npm / Yarn / pnpm all use `package.json`).

```bash
detect_pm() {
  if [ -f "yarn.lock" ]; then echo yarn
  elif [ -f "pnpm-lock.yaml" ]; then echo pnpm
  elif [ -f "package.json" ]; then echo npm
  elif [ -f "uv.lock" ]; then echo uv
  elif [ -f "pyproject.toml" ]; then echo pip
  elif [ -f "requirements.txt" ]; then echo pip-req
  elif [ -f "Gemfile" ]; then echo bundler
  elif [ -f "go.mod" ]; then echo go
  elif [ -f "Cargo.toml" ]; then echo cargo
  else echo none
  fi
}
```
