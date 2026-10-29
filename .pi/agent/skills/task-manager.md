---
name: task-manager
description: Integrated task and issue management handled by the Manager Agent. Creates, assigns, tracks, and closes tasks. Supports standalone file-based tracking and syncs with external providers (Linear, GitHub Issues, GitLab Issues). Use this whenever tasks need to be created, updated, prioritized, or reviewed.
---

# Task Manager Skill

Manager Agent owns all task/issue management. Single source of truth. No task exists outside this system.

## Task Lifecycle

```
                    ┌──────────┐
         ┌─────────│  CREATED  │
         │         └────┬─────┘
         │              │ assign to agent
         │              ▼
         │         ┌──────────┐
         │    ┌────│ ASSIGNED  │
         │    │    └────┬─────┘
         │    │         │ agent starts work
         │    │         ▼
         │    │    ┌──────────────┐
  reopen │    │    │ IN PROGRESS  │──────┐
         │    │    └────┬────────┘      │ blocked
         │    │         │               ▼
         │    │         │          ┌─────────┐
         │    │         │          │ BLOCKED  │
         │    │         │          └────┬────┘
         │    │         │               │ unblocked
         │    │         │◄──────────────┘
         │    │         │ agent submits PR
         │    │         ▼
         │    │    ┌──────────┐
         │    │    │ IN REVIEW │
         │    │    └────┬─────┘
         │    │         │
         │    │    ┌────┴────┐
         │    │    │         │
         │    │    ▼         ▼
         │    │  ✅ DONE   🔄 CHANGES
         │    │            REQUESTED
         │    │              │
         │    └──────────────┘ (back to assigned)
         │
         └── (reopen from DONE if regression found)
```

## Task Format

### Task ID Convention
```
TASK-<sequential-number>
```
Example: `TASK-001`, `TASK-042`, `TASK-100`

### Task Object
Every task has these fields:

```markdown
## TASK-001: Implement user authentication

| Field | Value |
|-------|-------|
| **ID** | TASK-001 |
| **Title** | Implement user authentication |
| **Type** | feature / bug / chore / refactor / docs / test |
| **Priority** | P0 (critical) / P1 (high) / P2 (medium) / P3 (low) |
| **Status** | created / assigned / in-progress / blocked / in-review / done / cancelled |
| **Agent** | backend / frontend / tester / database / devops |
| **Branch** | agent/backend/TASK-001-user-auth |
| **PR** | #12 (when submitted) |
| **Blocked By** | TASK-XXX (if blocked) |
| **Depends On** | TASK-XXX (prerequisite) |
| **Created** | 2026-10-28 |
| **Updated** | 2026-10-28 |
| **Completed** | — |
| **Estimate** | S / M / L / XL |

### Description
JWT-based authentication with login, register, refresh token.

### Acceptance Criteria
- [ ] POST /auth/register creates user
- [ ] POST /auth/login returns JWT + refresh token
- [ ] GET /auth/me returns current user (authenticated)
- [ ] Middleware rejects invalid/expired tokens with 401
- [ ] Rate limit: 5 login attempts per minute

### Test Requirements
- Unit tests for token service
- Integration tests for auth endpoints
- Security: SQL injection, token forgery

### Notes
RS256 key pair needed — see agent-env-manager.
```

## Storage: Dual Mode

### Mode 1: File-Based (Default — Always Active)

Tasks live in `.pi/agent/memory/BACKLOG.md` (summary) + `.pi/agent/tasks/` (detail).

```
.pi/agent/
├── memory/
│   └── BACKLOG.md          ← Summary view (all tasks, grouped by status)
└── tasks/
    ├── TASK-001.md          ← Full task detail
    ├── TASK-002.md
    ├── TASK-003.md
    └── ...
```

**BACKLOG.md** = dashboard view (always kept in sync):
```markdown
## 🔴 Blocked
| ID | Task | Blocked By | Agent | Since |
|----|------|-----------|-------|-------|
| TASK-005 | Payment integration | Midtrans credentials | backend | 2026-10-28 |

## 🟡 In Progress
| ID | Task | Agent | Branch | Started |
|----|------|-------|--------|---------|
| TASK-003 | Order detail page | frontend | agent/frontend/TASK-003 | 2026-10-28 |

## ⬜ Ready
| ID | Task | Agent | Priority | Estimate |
|----|------|-------|----------|----------|
| TASK-006 | E2E auth tests | tester | P1 | M |
| TASK-007 | Add Redis cache | devops | P2 | L |
```

**Individual task files** = full detail (created when task is created).

### Mode 2: External Provider Sync (Optional)

When credentials are available in `.pi/agent/.env`, sync with external providers.

#### Linear Integration (Project-Scoped)

**CRITICAL RULE**: Each project gets exactly **ONE dedicated Linear project**. All issues for this project live inside that Linear project only. Never create issues in other Linear projects. Never pollute other projects' boards.

**Credential Handling — Inherit from Host**:
Linear access is provided by the **host environment** (Pi built-in tools). Do NOT store or request `LINEAR_API_KEY` if the host already has a working connection.

On session start, run a connectivity check:
```
1. Call linear_list_teams → if success → connection available via host
2. Skip asking for LINEAR_API_KEY
3. Only store LINEAR_PROJECT_ID and LINEAR_TEAM_KEY in .pi/agent/.env
   (these are project-specific identifiers, not secrets)
```

**Rule**: If a credential already works at the host/global level, **never duplicate it** into `.pi/agent/.env`. Only store **project-specific identifiers** (project ID, team key) that differ per project.

```bash
# .pi/agent/.env — only project-specific values, NOT secrets
LINEAR_TEAM_KEY=IKA              # which team this project belongs to
LINEAR_PROJECT_ID=               # filled after project creation (UUID)
LINEAR_PROJECT_NAME=             # human-readable, matches project name
# LINEAR_API_KEY → NOT NEEDED, inherited from host
```

**First-time setup** (during project-onboarding):
1. Create a new Linear project named `[ProjectName]`
2. Save the returned project ID to `.pi/agent/.env` as `LINEAR_PROJECT_ID`
3. Create agent labels in the team (if not exist): `agent:manager`, `agent:backend`, `agent:frontend`, `agent:tester`, `agent:database`, `agent:devops`
4. All subsequent issues are created **with `projectId` set** — always.

**Sync behavior:**

| Action (Local) | → Linear |
|----------------|----------|
| Create task | → Create issue **in LINEAR_PROJECT_ID only** with label `agent:<role>` |
| Update status | → Update issue state (Backlog → In Progress → Done) |
| Assign agent | → Add label `agent:backend` (no Linear user assignment) |
| Set priority | → Map P0→Urgent, P1→High, P2→Medium, P3→Low |
| Close task | → Move to "Done" state |
| Add bug | → Create issue with "Bug" label **in LINEAR_PROJECT_ID** |
| Link PR | → Add PR link as attachment/comment |

| Action (Linear) | → Local |
|-----------------|--------|
| Issue created in project | → Create TASK-XXX.md on next sync |
| Status changed | → Update BACKLOG.md |
| Comment added | → Append to task notes |

**Guardrails:**
- On session start, verify Linear connection via `linear_list_teams` — if it works, host provides auth.
- Before creating any issue, **verify `LINEAR_PROJECT_ID` is set** in `.pi/agent/.env` — refuse if empty.
- On every issue create/update, **always include `projectId: LINEAR_PROJECT_ID`**.
- On session start, run a sanity check:
  ```
  List issues in LINEAR_PROJECT_ID → compare with local BACKLOG.md → flag drift
  ```
- **NEVER** store `LINEAR_API_KEY` in `.pi/agent/.env` if host already provides Linear access.
- **NEVER** create issues without `projectId` — orphan issues pollute the workspace.
- **NEVER** query or modify issues outside `LINEAR_PROJECT_ID` — not your scope.
- **NEVER** move issues to another project — if scope changed, discuss with user first.
- If user mentions another Linear project, clarify: *"That's outside this project's scope. Want me to create a separate task here instead?"*

#### GitHub Issues Integration
```bash
# Required in .pi/agent/.env
GITHUB_TOKEN=ghp_xxxxx
GITHUB_REPO=owner/repo
```

Sync behavior:
| Local Action | GitHub Action |
|-------------|---------------|
| Create task | `gh issue create --title "TASK-001: ..." --label "agent:backend"` |
| Close task | `gh issue close <number>` |
| Submit PR | `gh pr create --title "[TASK-001] ..." --body "..."` |

#### GitLab Issues Integration
```bash
# Required in .pi/agent/.env
GITLAB_TOKEN=glpat-xxxxx
GITLAB_PROJECT_ID=12345
GITLAB_URL=https://gitlab.com
```

Sync behavior:
| Local Action | GitLab Action |
|-------------|---------------|
| Create task | Create issue via API with label `agent:backend` |
| Close task | Close issue via API |
| Submit PR | Create MR via API |

## Manager Operations

### Create Task
```
Manager receives user request or identifies need
    │
    ▼
1. Generate TASK-XXX ID (next sequential)
2. Create .pi/agent/tasks/TASK-XXX.md with full detail
3. Add to BACKLOG.md under correct priority
4. If external provider configured → sync
5. Report: "Created TASK-XXX: <title> — assigned to <agent>"
```

### Assign Task
```
Manager picks task from BACKLOG.md
    │
    ▼
1. Update task status: created → assigned
2. Load sub-agent skill (e.g., sub-agent-backend.md)
3. Provide task context: description + acceptance criteria + relevant files
4. Sub-agent creates branch: agent/<role>/TASK-XXX-<description>
5. Update BACKLOG.md: move to "In Progress"
```

### Review Task (Quality Gate)
```
Sub-agent reports completion
    │
    ▼
1. Check all acceptance criteria met
2. Check tests pass + coverage threshold
3. Check lint + type-check clean
4. Check docs updated
5. Check commit messages + agent signature
    │
    ├── All pass → status: done, merge PR, update BACKLOG.md
    │
    └── Fail → status: changes-requested, send feedback to sub-agent
        └── Specific: "Test coverage 72%, need 80%. Missing test for edge case X."
```

### Close Task
```
1. Update task status → done
2. Set completed date
3. Move to "Done" section in BACKLOG.md
4. If external provider → close issue
5. Update STATE.md metrics
6. Add changelog entry (changelog-manager.md)
```

### Handle Bugs
```
Bug found (by tester, user, or during review)
    │
    ▼
1. Create task with type: bug
2. Set priority based on severity:
   - 🔴 Critical (P0): data loss, security, crash → immediate
   - 🟡 Medium (P1): wrong behavior but workaround exists → next sprint
   - 🟢 Low (P2): cosmetic, minor UX → backlog
3. Assign to responsible agent
4. Link to original task if regression
5. If external provider → create issue with "bug" label
```

### Sprint Planning
When user asks "what's next?" or at start of work session:

```markdown
## Sprint Plan

### Goal
Complete payment integration + order detail page.

### Tasks This Sprint
| # | ID | Task | Agent | Priority | Estimate | Depends On |
|---|-----|------|-------|----------|----------|-----------|
| 1 | TASK-005 | Midtrans payment | backend | P0 | L | credentials ✅ |
| 2 | TASK-003 | Order detail page | frontend | P0 | M | TASK-010 ✅ |
| 3 | TASK-006 | Payment E2E tests | tester | P1 | M | TASK-005 |
| 4 | TASK-008 | Payment webhook | backend | P1 | M | TASK-005 |

### Estimated Completion
2-3 sessions (~6-8 hours of agent work)

### Blockers
None currently.

Approve this plan? Or adjust priorities?
```

## Auto-Decomposition

When user gives a large feature request, Manager auto-decomposes:

```
User: "Add payment with Midtrans"
    │
    ▼
Manager decomposes:

TASK-005: [backend] Midtrans SDK integration + payment service
TASK-006: [database] Create payments table + migration
TASK-007: [backend] Payment webhook endpoint (notification handler)
TASK-008: [frontend] Checkout page + payment flow UI
TASK-009: [frontend] Payment status page (success/pending/failed)
TASK-010: [tester] Payment E2E tests (success, failure, webhook)
TASK-011: [devops] Add Midtrans credentials to CI/CD secrets

Dependencies:
  TASK-006 → TASK-005 → TASK-007
  TASK-005 → TASK-008 → TASK-009
  TASK-005 + TASK-008 → TASK-010
  TASK-011 runs parallel

Report decomposition to user for approval.
```

## Task Commands (User Can Say)

| Command | Action |
|---------|--------|
| "bikin task ..." | Create new task |
| "list tasks" / "backlog" | Show BACKLOG.md summary |
| "status" | Current sprint status |
| "task TASK-001" | Show full task detail |
| "prioritize TASK-005 P0" | Change priority |
| "block TASK-005 karena X" | Mark blocked with reason |
| "unblock TASK-005" | Remove blocker |
| "close TASK-005" | Mark done |
| "sprint plan" | Generate sprint plan |
| "decompose: <feature>" | Break feature into tasks |
| "sync tasks" | Sync with external provider |
| "bugs" | List all open bugs |

## Constraints
- **Every task MUST have**: ID, title, type, priority, agent, acceptance criteria.
- **BACKLOG.md** must always reflect the truth — sync after every change.
- **Task files are committed to git** — they are project documentation.
- **Never delete task files** — cancelled tasks stay for history (status: cancelled).
- **Manager owns all task operations** — sub-agents cannot create/close tasks.
- **External sync is optional** — file-based is always the primary source.
- **Auto-decompose large requests** — never assign a vague multi-day task to one agent.
- **Max 3 tasks in-progress per agent** — prevent context switching overhead.
