# AGENTS.md — Skill & Workflow Registry

> Daftar semua skill dan workflow yang tersedia untuk AI Agent di project ini.
> AI Agent membaca file ini untuk tau kapabilitas apa yang dia punya.

## Apa Itu Skill?

**Skill** = instruksi spesifik yang memberikan AI Agent kemampuan khusus untuk project tertentu.

Setiap skill file berisi:
- **Frontmatter** (YAML): `name` dan `description` — agar agent tahu kapan harus pakai skill ini
- **Instructions**: Step-by-step cara eksekusi
- **Constraints**: Batasan dan safety rules

AI Agent akan **otomatis mengikuti instruksi di skill** ketika user meminta sesuatu yang match dengan `description`.

## Cara Kerja

```
User: "cek berapa total orders bulan ini"
          │
          ▼
AI Agent membaca AGENTS.md
          │
          ▼
Match skill: database-inspector
          │
          ▼
Ikuti instruksi di skills/database-inspector.md
          │
          ▼
Execute: python scripts/query_runner.py "SELECT COUNT(*) FROM orders WHERE..."
          │
          ▼
Return: Markdown table dengan hasil
```

## Registered Skills

<!-- TAMBAH SKILL BARU DISINI -->

| # | Skill File | Nama | Untuk |
|---|-----------|------|-------|
| 1 | `skills/database-inspector.md` | Database Inspector | Query database lokal dengan aman (SELECT only) |
| 2 | `skills/git-commit-formatter.md` | Git Commit Formatter | Format commit message sesuai Conventional Commits |
| 3 | `skills/license-header-adder.md` | License Header Adder | Tambah copyright header ke file baru sesuai bahasa |
| 4 | `skills/agent-env-manager.md` | Agent Env Manager | Manage credentials & API keys yang dipakai AI Agent sendiri |
| 5 | `skills/safe-migration.md` | Safe Migration | DB migration tanpa DROP/TRUNCATE, never touch production |
| 6 | `skills/auto-documentation.md` | Auto Documentation | Sync docs otomatis setiap code berubah |
| 7 | `skills/code-conduct.md` | Code Conduct | Strict coding rules: naming, function size, error handling |
| 8 | `skills/changelog-manager.md` | Changelog Manager | Keep a Changelog + Semantic Versioning |
| 9 | `skills/worktree-rules.md` | Worktree Rules | Git branching, worktree, commit discipline |
| 10 | `skills/agent-manager.md` | **Agent Manager** | 🧠 Core orchestrator — plan, delegate, review, merge |
| 11 | `skills/agent-memory.md` | **Agent Memory** | 🧠 Persistent memory — STATE, ARCHITECTURE, PRD, SPEC, session continuity |
| 12 | `skills/project-onboarding.md` | **Project Onboarding** | 🚀 First-run: credential detection, git repo creation (GH/GL API), Linear project setup, scaffold, memory init, initial backlog |
| 13 | `skills/task-manager.md` | **Task Manager** | 📋 Issue/task lifecycle, backlog, sprint, Linear sync (project-scoped) |
| 14 | `skills/sub-agent-backend.md` | Sub-Agent: Backend | API, services, middleware, business logic |
| 15 | `skills/sub-agent-frontend.md` | Sub-Agent: Frontend | UI components, pages, state, styling, a11y |
| 16 | `skills/sub-agent-tester.md` | Sub-Agent: Tester | Tests, coverage, QA, bug reports (ISO 29119) |
| 17 | `skills/sub-agent-database.md` | Sub-Agent: Database | Schema, migrations, seeds, query optimization |
| 18 | `skills/sub-agent-devops.md` | Sub-Agent: DevOps | Docker, CI/CD, deploy, infra, monitoring |

## Cara Bikin Skill Baru

1. Buat file `.md` di folder `skills/`
2. Isi dengan format:

```markdown
---
name: <skill-name-kebab-case>
description: <Kapan skill ini dipakai — 1-2 kalimat>
---

# <Nama Skill>

## Instructions
1. <Step 1>
2. <Step 2>
3. ...

## Constraints
- <Batasan 1>
- <Batasan 2>
```

3. Register di tabel **Registered Skills** di atas
4. Done — AI Agent langsung bisa pakai

## Contoh Skill per Stack

Berikut ide skill yang bisa dibuat sesuai kebutuhan project:

### Frontend (Nuxt / Angular / Vue / React)
| Skill | Fungsi |
|-------|--------|
| `component-generator` | Generate component dari deskripsi natural language |
| `route-inspector` | Analisis & list semua routes yang terdaftar |
| `state-debugger` | Inspect Pinia/Vuex/NgRx store state |
| `i18n-checker` | Cek missing translation keys |
| `lighthouse-runner` | Jalankan Lighthouse audit & summarize hasilnya |

### Backend (Python / Go / Node)
| Skill | Fungsi |
|-------|--------|
| `api-tester` | Hit endpoint lokal & format response |
| `migration-runner` | Jalankan DB migration dengan safety check |
| `log-analyzer` | Parse & summarize log files |
| `env-validator` | Validasi .env vs .env.example |
| `dependency-auditor` | Cek outdated/vulnerable packages |

### Database (PostgreSQL / MySQL / SQLite / MongoDB)
| Skill | Fungsi |
|-------|--------|
| `database-inspector` | Safe SELECT queries + result formatting |
| `schema-documenter` | Generate ERD / schema docs dari DB aktual |
| `seed-generator` | Bikin seed data dari deskripsi |
| `query-optimizer` | Analyze slow queries + suggest index |

### DevOps / Infra
| Skill | Fungsi |
|-------|--------|
| `docker-manager` | Manage containers (up/down/logs/rebuild) |
| `deploy-checker` | Verify deployment health |
| `nginx-configurator` | Generate/validate nginx config |
| `ssl-monitor` | Cek SSL certificate expiry |

### General
| Skill | Fungsi |
|-------|--------|
| `git-summarizer` | Summarize recent commits & changes |
| `test-runner` | Jalankan test suite & format results |
| `doc-generator` | Generate API docs / README dari codebase |
| `code-reviewer` | Review PR/diff dengan checklist |

## Registered Workflows

> Workflow = urutan multi-skill yang dijalankan berurutan.

| # | Workflow File | Nama | Skills Used |
|---|--------------|------|-------------|
| — | — | — | — |

<!-- Contoh workflow:
| 1 | `workflows/full-deploy.md` | Full Deploy | env-validator → test-runner → docker-manager → deploy-checker |
-->

---

*Register setiap skill/workflow baru di file ini agar AI Agent aware.*
