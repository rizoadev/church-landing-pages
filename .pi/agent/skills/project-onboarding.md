---
name: project-onboarding
description: First-run initialization when AI Agent is activated on a new project. Handles project setup, git repo creation (GitHub/GitLab), Linear project setup, memory initialization, and initial architecture. Triggers automatically when STATE.md shows Session #0 or when user says "init project" / "start project" / "bikin project".
---

# Project Onboarding Skill

First-time setup when AI Agent starts on a fresh project. Two modes: **guided** (user belum tau detail) or **direct** (user sudah tau mau apa).

## Detection

On session start, after reading memory (per agent-memory.md protocol):
- If `STATE.md` shows `Session: #0` → trigger onboarding
- If project directory has no `src/`, no `package.json`/`pyproject.toml`/`go.mod` → trigger onboarding
- If user says "init", "start project", "bikin project", "setup" → trigger onboarding

---

## Mode 1: Direct (User Knows What They Want)

User says something like:
> "Bikin project order management system, backend FastAPI + PostgreSQL, frontend Nuxt 3, deploy Docker"

Agent immediately:

### Step 1 — Parse & Confirm
Extract from user request and confirm:

```markdown
## Project Setup Confirmation

| Field | Value |
|-------|-------|
| **Project Name** | order-management |
| **Slug** | order-management |
| **Type** | Fullstack |
| **Backend** | FastAPI (Python 3.12) |
| **Frontend** | Nuxt 3 (Vue 3 + TypeScript) |
| **Database** | PostgreSQL 16 |
| **Deploy** | Docker + Docker Compose |
| **Repo** | GitLab / GitHub (which?) |

Proceed? (y/n or adjust)
```

### Step 2 — Initialize (on confirm)

Execute sequentially. Every step must complete before moving to the next.

---

#### 2.1 — Host Credential Detection

Probe what's already available. **Do NOT ask for keys that already work.**

```bash
# Linear — via Pi built-in tools
linear_list_teams → success?
  ✅ LINEAR: connected (host-level, no key needed)
  ❌ LINEAR: not available

# GitHub — via gh CLI
gh auth status 2>&1
  ✅ GITHUB: authenticated as <user>
  ❌ GITHUB: not logged in

# GitLab — via glab CLI
glab auth status 2>&1
  ✅ GITLAB: authenticated as <user> on <instance>
  ❌ GITLAB: not logged in

# Docker
docker info >/dev/null 2>&1
  ✅ DOCKER: available
  ❌ DOCKER: not available
```

Report to user:
```
Host credentials detected:
  Linear  ✅ Connected (Pi built-in)
  GitHub  ✅ Authenticated (gh CLI)
  GitLab  ❌ Not available
  Docker  ✅ Available

Only need from you: GitLab token (if you want GitLab repo)
```

**Rule**: If host provides it → use it, don't store. Only ask for what's missing.

---

#### 2.2 — Git Repository Creation

Based on user's chosen provider, **create the remote repo via API/CLI**, not just `git remote add`.

##### GitHub
```bash
# 1. Create remote repo
gh repo create <org>/<project-slug> --private --description "<project description>"
# or public:
gh repo create <org>/<project-slug> --public --description "<project description>"

# 2. Initialize local git
git init
git branch -M main

# 3. Create comprehensive .gitignore
# (auto-detect from stack: Python, Node, Go, etc.)
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
vendor/
__pycache__/
*.pyc
.venv/

# Build
dist/
build/
*.egg-info/

# Environment
.env
.env.local
.env.*.local

# Agent secrets (NEVER commit)
.pi/agent/.env
.pi/agent/*.key
.pi/agent/*.pem

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Test
coverage/
.nyc_output/
htmlcov/
.pytest_cache/
EOF

# 4. Create README.md (project name, stack, setup instructions)

# 5. Create CHANGELOG.md (per changelog-manager.md)

# 6. Initial commit
git add .
git commit -m "chore: initialize project

- Project scaffold with .pi agent configuration
- .gitignore for <stack>
- README with setup instructions
- CHANGELOG initialized

Agent: manager
Task: ONBOARD
Tests: N/A (initial setup)"

# 7. Connect remote & push
git remote add origin git@github.com:<org>/<project-slug>.git
git push -u origin main

# 8. Create dev branch
git checkout -b dev
git push -u origin dev
git checkout main

# 9. Set default branch to dev (for PRs)
gh repo edit <org>/<project-slug> --default-branch dev

# 10. Branch protection (optional, ask user)
# gh api repos/<org>/<project-slug>/branches/main/protection ...
```

##### GitLab
```bash
# 1. Create remote repo via glab or API
glab repo create <group>/<project-slug> --private --description "<project description>"
# or via API if glab not available:
curl --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
     --data "name=<project-slug>&namespace_id=<group-id>&visibility=private" \
     "https://gitlab.com/api/v4/projects"

# 2-8. Same as GitHub (init, .gitignore, commit, push, dev branch)

# 9. Connect remote
git remote add origin git@gitlab.com:<group>/<project-slug>.git
git push -u origin main
git checkout -b dev && git push -u origin dev && git checkout main

# 10. Set default branch
glab repo edit --default-branch dev
# or via API:
curl --request PUT --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
     --data "default_branch=dev" \
     "https://gitlab.com/api/v4/projects/<project-id>"
```

**Save to `.pi/agent/.env`:**
```env
GIT_PROVIDER=github          # or gitlab
GIT_REPO_URL=git@github.com:org/project-slug.git
GIT_REPO_SLUG=org/project-slug
```

---

#### 2.3 — Linear Project Setup

Only if Linear is connected (detected in step 2.1).

```
1. List available teams:
   └── linear_list_teams → show to user
   └── User picks team (or use default if only one)

2. Create Linear project:
   └── linear_save_project({
         name: "<ProjectName>",
         teamIds: ["<selected-team-id>"],
         description: "<from user's project description>"
       })
   └── Save returned project ID

3. Create agent labels (if not already exist in team):
   └── linear_list_issue_labels({ teamKey: "<key>" })
   └── For each missing label, create:
       - agent:manager    (color: #5E6AD2)
       - agent:backend    (color: #0EA5E9)
       - agent:frontend   (color: #F59E0B)
       - agent:tester     (color: #10B981)
       - agent:database   (color: #8B5CF6)
       - agent:devops     (color: #EF4444)
       - type:bug         (color: #DC2626)  — if not exist
       - type:feature     (color: #2563EB)  — if not exist
       - type:chore       (color: #6B7280)  — if not exist

4. Save to .pi/agent/.env:
   LINEAR_TEAM_KEY=IKA
   LINEAR_PROJECT_ID=<uuid>
   LINEAR_PROJECT_NAME=<ProjectName>

5. Confirm to user:
   "Linear project 'OrderManagement' created in team IKA (ID: xxx).
    6 agent labels + 3 type labels created.
    All issues will be scoped to this project."
```

If Linear NOT available:
```
Skip Linear setup.
Note in STATE.md: "Task management: file-based only (Linear not connected)"
File-based tasks in .pi/agent/tasks/ remain fully functional.
```

---

#### 2.4 — Project Scaffold

Based on detected stack, generate project structure:

```
project-root/
├── backend/ or src/        ← Backend code (FastAPI/Go/Node)
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── middleware/
├── frontend/               ← Frontend code (Nuxt/Angular/Vue — if fullstack)
├── tests/                  ← Test structure mirroring src
├── migrations/             ← DB migrations (up + down)
├── seeds/                  ← Seed data for dev
├── scripts/                ← Utility scripts
├── docs/                   ← Documentation
├── docker-compose.yml      ← If Docker selected
├── Dockerfile              ← If Docker selected
└── .github/ or .gitlab-ci.yml  ← CI/CD
```

**For each stack, generate minimal runnable boilerplate:**
- Backend: hello world endpoint + health check
- Frontend: landing page + router setup
- Docker: working compose with app + DB
- CI/CD: lint + test + build pipeline

Verify it works:
```bash
# Backend
cd backend && <install deps> && <run tests> && <start server>
# → GET /health should return 200

# Frontend (if applicable)
cd frontend && <install deps> && <run dev server>
# → Page loads in browser

# Docker (if applicable)
docker compose up -d && sleep 5 && curl localhost:3000/health
# → Should return OK
```

---

#### 2.5 — Memory Initialization

Fill ALL memory files with actual project data (not templates):

| File | Content Source |
|------|--------------|
| `STATE.md` | Session #1, project summary, initial environment status |
| `ARCHITECTURE.md` | Chosen stack, generated directory structure, data flow |
| `WHITEPAPER.md` | Extracted from user's project description |
| `PRD.md` | Features decomposed from description → P0/P1/P2 |
| `SPEC.md` | Initial API design, data models based on domain |
| `BUSINESS_PROCESS.md` | Core flows inferred from project type |
| `DECISIONS.md` | ADR-001: tech stack selection with rationale |
| `SESSION_LOG.md` | Session #1: onboarding completed |
| `BACKLOG.md` | Initial tasks derived from PRD, ordered by priority |

Also update:
- `.pi/SYSTEM.md` — fill Project Context table with actual values
- `.pi/AGENTS.md` — update skill count to reflect current total

---

#### 2.6 — Initial Backlog Generation

Auto-decompose the project into initial tasks:

**Every project gets these base tasks:**
```
TASK-001 [database]  — Design initial schema + create migration
TASK-002 [backend]   — Project setup + health endpoint + base middleware
TASK-003 [frontend]  — Project setup + layout + router (if fullstack)
TASK-004 [devops]    — Docker + CI/CD pipeline
TASK-005 [tester]    — Test infrastructure setup + first smoke test
TASK-006 [docs]      — Initial API docs + architecture diagram
```

**Plus domain-specific tasks derived from PRD:**
```
TASK-007 [database]  — Create users table + auth schema
TASK-008 [backend]   — Authentication (register, login, JWT)
TASK-009 [frontend]  — Login + register pages
TASK-010 [tester]    — Auth flow E2E tests
...
```

Create individual task files in `.pi/agent/tasks/` AND sync to Linear (if connected).

---

#### 2.7 — CI/CD Scaffold

Generate working CI/CD config for the chosen provider:

**GitHub Actions** → `.github/workflows/ci.yml`
**GitLab CI** → `.gitlab-ci.yml`

Pipeline stages:
```
PR/MR opened → lint → type-check → test → build → (security scan)
```

---

#### 2.8 — Final Commit & Report

```bash
# Commit everything
git add .
git commit -m "chore: complete project onboarding

- Project scaffold: <stack summary>
- Memory system initialized (9 files)
- Initial backlog: X tasks created
- Linear project: <name> (ID: <uuid>)
- CI/CD: <provider> pipeline configured
- Docker: compose + Dockerfile ready

Agent: manager
Task: ONBOARD
Tests: scaffold smoke test passed"

# Push
git push origin main
git checkout dev && git merge main && git push origin dev
```

Report to user:

```markdown
## 🚀 Project Initialized

**<Project Name>** is fully set up.

### Infrastructure
| Component | Status | Details |
|-----------|--------|---------|
| Git repo | ✅ Created | <provider>: <org>/<slug> (private) |
| Branches | ✅ Ready | main + dev (default: dev) |
| Linear | ✅ Connected | Project: <name> in team <key> |
| Docker | ✅ Configured | compose + Dockerfile |
| CI/CD | ✅ Pipeline | <provider> — lint/test/build on PR |

### Memory
All 9 memory files initialized with project-specific content.

### Initial Backlog
| ID | Task | Agent | Priority |
|----|------|-------|----------|
| TASK-001 | ... | database | P0 |
| TASK-002 | ... | backend | P0 |
| TASK-003 | ... | frontend | P0 |
| ... | ... | ... | ... |

**Total: X tasks** (Y P0, Z P1, W P2)

### Next Step
Ready to start. Pick a task or say "gas" and I'll run all P0s.
```

---

## Mode 2: Guided (User Needs Help Deciding)

User says something like:
> "Mau bikin project baru" / "Start project" / "Init"

Agent asks **minimal questions** (max 5, in sequence — not all at once):

### Question 1: What
```
Mau bikin apa? Jelaskan singkat projectnya.
Contoh: "E-commerce platform", "Internal dashboard", "API service for mobile app"
```

### Question 2: Stack
```
Stack preference?
- Frontend: Nuxt / Angular / Vue / React / None (API only)
- Backend: FastAPI / Go / Node+Express / Node+Fastify
- DB: PostgreSQL / MySQL / SQLite / MongoDB
- Atau biar aku rekomendasikan berdasarkan kebutuhan?
```

### Question 3: Scope
```
Ini project skala apa?
- Solo / small team (simple setup)
- Medium team (full CI/CD, staging env)
- Enterprise (microservices, monitoring, multi-env)
```

### Question 4: Repo
```
Git provider? (aku cek dulu yang udah available di host)

Detected:
  GitHub  ✅ authenticated as <user>
  GitLab  ❌ not available

Mau pakai GitHub? Atau setup GitLab dulu?
```
*→ Show detected providers, suggest the one that's ready.*

### Question 5: Confirm
Same as Mode 1 Step 1 — show table, confirm, then execute Step 2.

---

## Constraints
- **NEVER** skip any onboarding step — every step must complete.
- **NEVER** assume stack — always confirm with user.
- **NEVER** ask for credentials the host already provides.
- **NEVER** start coding before onboarding is complete.
- **NEVER** create a repo without user choosing provider and confirming.
- **ALWAYS** verify the scaffold works (health endpoint, build, docker up) before reporting success.
- **ALWAYS** create the remote repo via API/CLI — don't just `git remote add` to a non-existent repo.
- **ALWAYS** create both `main` and `dev` branches, set `dev` as default.
- **ALWAYS** create Linear project scoped to this project only (if Linear available).
- **ALWAYS** generate initial backlog with at least 5 actionable tasks.
- Keep guided questions to **max 5** — don't interrogate the user.
- If user gives partial info, fill what you can and ask only what's missing.
