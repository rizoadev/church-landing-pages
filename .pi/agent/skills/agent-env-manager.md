---
name: agent-env-manager
description: Manages the AI agent's own credentials and API keys used for integrations (GitLab, Linear, Supabase, etc). Use this when the agent needs to authenticate with external services or when setting up/rotating agent credentials.
---

# Agent Env Manager Skill

Manage credentials and API keys that the AI Agent uses to interact with external services.

## Instructions

### 1. Storage Location
Agent credentials live in `.pi/agent/.env` (gitignored, never committed).

```
.pi/
└── agent/
    ├── .env              # Real secrets (GITIGNORED)
    ├── .env.example      # Key names + descriptions (committed)
    └── skills/
```

### 2. .env.example Format
Always maintain a `.env.example` listing every key the agent needs:
```env
# === Git Provider ===
GITLAB_TOKEN=              # Personal Access Token (api scope)
GITLAB_URL=                # e.g. https://gitlab.com
GITHUB_TOKEN=              # PAT (repo, workflow scope)

# === Project Management ===
LINEAR_API_KEY=            # Linear personal API key
ASANA_TOKEN=               # Asana personal access token

# === Database ===
SUPABASE_URL=              # Project URL
SUPABASE_SERVICE_KEY=      # Service role key (NOT anon key)

# === Cloud / Deploy ===
CF_API_TOKEN=              # Cloudflare API token
VERCEL_TOKEN=              # Vercel deploy token
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# === Communication ===
SLACK_WEBHOOK_URL=         # For notifications
DISCORD_WEBHOOK_URL=

# === AI / LLM ===
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

### 3. Loading Credentials — Inheritance Chain
Credentials are resolved in this order (first match wins):

```
1. Host / Global environment (system env vars, Pi built-in integrations)
2. .pi/agent/.env (project-specific overrides)
```

**Rule: Never duplicate what the host already provides.**

Before asking user for any credential:
1. **Check if it already works at host level** (e.g. call `linear_list_teams` — if it succeeds, Linear is connected globally)
2. If host provides it → **skip**, don't store in `.pi/agent/.env`
3. If host doesn't have it → ask user, store in `.pi/agent/.env`
4. **Project-specific identifiers** (project ID, team key, repo slug) always go in `.pi/agent/.env` because they differ per project — these are NOT secrets.

Host connectivity checks:
```
Linear    → linear_list_teams         → success? skip LINEAR_API_KEY
GitHub    → gh auth status            → success? skip GITHUB_TOKEN
GitLab    → glab auth status          → success? skip GITLAB_TOKEN
Docker    → docker info               → success? skip DOCKER_REGISTRY_*
AWS       → aws sts get-caller-id     → success? skip AWS_*
```

### 4. Adding New Credentials
When a new integration is needed:
1. Add the key name + description to `.pi/agent/.env.example`
2. Ask the user for the actual value
3. Write ONLY to `.pi/agent/.env` (never to .env.example or any other file)
4. Verify `.pi/agent/.env` is in `.gitignore`

### 5. Rotation & Validation
- Before using a credential, validate it's not empty/placeholder.
- If an API call returns 401/403, report "credential may be expired or invalid" — suggest rotation.
- Never cache credentials outside of `.pi/agent/.env`.

### 6. Gitignore Enforcement
Ensure `.gitignore` contains:
```
.pi/agent/.env
.pi/agent/*.key
.pi/agent/*.pem
```
If missing, add it immediately and warn the user.

## Constraints
- **NEVER** print, log, echo, or display actual secret values in output.
- **NEVER** commit `.pi/agent/.env` — verify gitignore on every session.
- **NEVER** hardcode credentials in skill files, scripts, or any tracked file.
- If the user pastes a credential in chat, immediately write it to `.pi/agent/.env` and remind them to rotate it if it was exposed.
- When displaying credential status, only show: `GITLAB_TOKEN=****` (masked) or `GITLAB_TOKEN=<not set>`.
