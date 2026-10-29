---
name: agent-memory
description: Persistent memory system for the Manager Agent. Maintains project state, architecture knowledge, and session continuity across context windows. Read on every session start. Update after every meaningful change.
---

# Agent Memory Skill

The Manager Agent operates 24/7. Memory persists across sessions, context window resets, and crashes. You always know where the project stands.

## Memory Architecture

```
.pi/agent/memory/
├── STATE.md              ← Current project state (READ FIRST, ALWAYS)
├── ARCHITECTURE.md       ← System architecture & tech decisions
├── WHITEPAPER.md         ← Project vision, goals, business case
├── PRD.md                ← Product Requirements Document
├── SPEC.md               ← Technical Specification
├── BUSINESS_PROCESS.md   ← Business logic flows & rules
├── DECISIONS.md          ← Architecture Decision Records (ADR)
├── SESSION_LOG.md        ← Session-by-session changelog
└── BACKLOG.md            ← Task queue, priorities, blockers
```

## Session Protocol

### On Session Start (MANDATORY)
Every time a new session begins or context window resets:

```
1. Read .pi/agent/memory/STATE.md           ← Where are we?
2. Read .pi/agent/memory/BACKLOG.md          ← What's next?
3. Read .pi/agent/memory/ARCHITECTURE.md     ← How does it all fit?
4. Check git log --oneline -20               ← Recent changes
5. Check git status                          ← Uncommitted work?
6. Check git branch -a                       ← Active branches
7. Report to user: "Resumed. Here's where we are: ..."
```

### On Session End / Before Context Limit
When the context window is running out or the session is ending:

```
1. Update STATE.md with current position
2. Update BACKLOG.md with remaining tasks
3. Log session summary in SESSION_LOG.md
4. Commit memory files: "chore(memory): update project state — Agent: manager"
5. Report to user: "State saved. Next session can pick up from: ..."
```

---

## Memory File Formats

### STATE.md — Current Project State

```markdown
# Project State

> Last updated: 2026-10-28T14:30:00Z
> Updated by: Agent: manager
> Session: #42

## Quick Resume
<!-- ONE paragraph. Enough for any agent to understand where we are RIGHT NOW -->
We're building a SaaS order management system. Backend API is 80% done (auth, orders, products).
Frontend has login + dashboard. Currently working on: payment integration (Midtrans).
Blocked on: Midtrans sandbox credentials from client.

## Active Tasks
| ID | Description | Agent | Branch | Status |
|----|-------------|-------|--------|--------|
| TASK-012 | Midtrans payment integration | backend | agent/backend/TASK-012-midtrans | 🚫 Blocked (credentials) |
| TASK-013 | Order detail page | frontend | agent/frontend/TASK-013-order-detail | 🔄 In Progress |
| TASK-014 | Payment E2E tests | tester | — | ⏳ Waiting on TASK-012 |

## Recently Completed
| ID | Description | Agent | PR | Merged |
|----|-------------|-------|-----|--------|
| TASK-010 | Order list API + pagination | backend | PR #18 | ✅ 2026-10-27 |
| TASK-011 | Order list page + filters | frontend | PR #19 | ✅ 2026-10-27 |

## Known Issues
- [ ] BUG-003: Order total doesn't include tax — needs fix in OrderService
- [ ] PERF-001: Product list query slow >500ms on 10k rows — needs index

## Environment Status
| Service | Status | Notes |
|---------|--------|-------|
| Backend API | ✅ Running | localhost:3000 |
| Frontend | ✅ Running | localhost:5173 |
| PostgreSQL | ✅ Running | Docker, port 5432 |
| Redis | ❌ Not setup | Needed for TASK-015 (caching) |

## Metrics
| Metric | Value |
|--------|-------|
| Total tasks completed | 11 |
| Total tasks remaining | 8 |
| Test coverage (BE) | 87% |
| Test coverage (FE) | 72% |
| Open bugs | 2 |
| Current version | 0.4.0-dev |
```

### ARCHITECTURE.md — System Architecture

```markdown
# System Architecture

> Living document. Updated on every architectural decision.

## Overview
<!-- High-level system diagram in ASCII or description -->

## Stack
| Layer | Technology | Version | Why |
|-------|-----------|---------|-----|

## Directory Structure
<!-- Actual project structure, not aspirational -->

## Data Flow
<!-- Request → Response flow for key operations -->

## Database Schema
<!-- Current ERD or table listing -->

## API Map
<!-- All endpoints, grouped by domain -->

## Infrastructure
<!-- Docker, servers, CDN, DNS, etc. -->

## Security Model
<!-- Auth flow, token handling, permissions -->

## Integration Points
<!-- Third-party APIs, webhooks, submodules -->
```

### WHITEPAPER.md — Project Vision

```markdown
# Whitepaper: <Project Name>

## Problem Statement
<!-- What problem does this solve? -->

## Solution
<!-- How does this project solve it? -->

## Target Users
<!-- Who uses this? Personas. -->

## Value Proposition
<!-- Why this over alternatives? -->

## Business Model
<!-- How does this make money / create value? -->

## Success Metrics
<!-- KPIs, measurable goals -->

## Roadmap
<!-- Phase 1, 2, 3... with milestones -->

## Risks & Mitigations
<!-- What could go wrong, how to handle it -->
```

### PRD.md — Product Requirements

```markdown
# Product Requirements Document

## Features
<!-- Feature list with priority (P0, P1, P2) -->

### P0 — Must Have (MVP)
| # | Feature | Status | Notes |
|---|---------|--------|-------|

### P1 — Should Have (v1.0)
| # | Feature | Status | Notes |
|---|---------|--------|-------|

### P2 — Nice to Have (Future)
| # | Feature | Status | Notes |
|---|---------|--------|-------|

## User Stories
<!-- As a [role], I want [capability], so that [benefit] -->

## Non-Functional Requirements
| Requirement | Target |
|-------------|--------|
| Response time | < 200ms (p95) |
| Uptime | 99.9% |
| Concurrent users | 1,000 |
| Data retention | 5 years |

## Constraints & Assumptions
<!-- Technical, business, legal constraints -->
```

### SPEC.md — Technical Specification

```markdown
# Technical Specification

## API Specification
<!-- Endpoint details: method, path, request, response, auth, errors -->

## Data Models
<!-- Detailed schema with types, constraints, relations -->

## Business Logic Rules
<!-- Computation rules, validation rules, state machines -->

## Error Codes
<!-- Application-specific error codes and meanings -->

## Configuration
<!-- All configurable values and their defaults -->

## Dependencies
<!-- External libraries, services, and their versions -->
```

### BUSINESS_PROCESS.md — Business Logic Flows

```markdown
# Business Process Documentation

## Core Flows
<!-- Step-by-step business processes -->

### Flow: Order Placement
1. User adds items to cart
2. User proceeds to checkout
3. System validates stock availability
4. System calculates total (items + tax + shipping)
5. User selects payment method
6. System creates order (status: PENDING)
7. User completes payment
8. System confirms payment (status: PAID)
9. System notifies warehouse (status: PROCESSING)

### Flow: ...

## State Machines
<!-- Object lifecycle states and transitions -->

### Order States
```
DRAFT → PENDING → PAID → PROCESSING → SHIPPED → DELIVERED
                ↘ CANCELLED
                         ↘ REFUNDED
```

## Business Rules
<!-- If X then Y rules -->
| Rule | Condition | Action |
|------|-----------|--------|
```

### DECISIONS.md — Architecture Decision Records

```markdown
# Architecture Decision Records

## ADR-001: Use PostgreSQL over MySQL
- **Date**: 2026-10-01
- **Status**: Accepted
- **Context**: Need relational DB with JSON support and strong consistency
- **Decision**: PostgreSQL 16
- **Consequences**: Team needs pg expertise; gain JSONB, CTE, window functions

## ADR-002: ...
```

### SESSION_LOG.md — Session History

```markdown
# Session Log

## Session #42 — 2026-10-28
- **Duration**: ~2 hours
- **Focus**: Order management module
- **Completed**:
  - TASK-010: Order list API with pagination
  - TASK-011: Order list frontend page
- **Started**:
  - TASK-012: Midtrans payment (blocked on credentials)
  - TASK-013: Order detail page (in progress)
- **Decisions**:
  - ADR-005: Use Midtrans Snap for payment (simpler integration)
- **Issues Found**:
  - BUG-003: Tax calculation missing in OrderService
- **Next Session**:
  - Follow up on Midtrans credentials
  - Complete TASK-013
  - Start TASK-014 (payment E2E tests) once TASK-012 unblocked

## Session #41 — 2026-10-27
...
```

### BACKLOG.md — Task Queue

```markdown
# Task Backlog

> Ordered by priority. Manager pulls from top.

## 🔴 Blocked
| ID | Task | Blocked By | Agent |
|----|------|-----------|-------|

## 🟡 In Progress
| ID | Task | Agent | Branch | ETA |
|----|------|-------|--------|-----|

## ⬜ Ready (Next Up)
| ID | Task | Agent | Priority | Estimate |
|----|------|-------|----------|----------|

## 🔵 Backlog (Future)
| ID | Task | Agent | Priority | Notes |
|----|------|-------|----------|-------|

## ✅ Done (Recent)
| ID | Task | Agent | PR | Completed |
|----|------|-------|-----|-----------|
```

---

## Memory Update Rules

### MUST Update STATE.md When:
- A task status changes (started, completed, blocked)
- A sub-agent reports back
- A PR is merged
- A bug is found
- Environment changes (new service, service down)
- Version bump

### MUST Update ARCHITECTURE.md When:
- New technology added to stack
- Directory structure changes significantly
- New API endpoint added
- Database schema changes
- New integration / submodule added
- ADR recorded

### MUST Update SESSION_LOG.md When:
- Session ends or context window approaching limit
- Every ~2 hours of continuous work (checkpoint)

### MUST Update BACKLOG.md When:
- New task identified
- Task priority changes
- Task completed or blocked
- Dependencies resolved

### MUST Update WHITEPAPER/PRD/SPEC When:
- Project scope changes
- New feature added to roadmap
- Business requirement changes
- User confirmed by real-world feedback

## Constraints
- **STATE.md is READ FIRST on EVERY session start** — no exceptions.
- **Never start working without reading memory** — you will lose context.
- **Never end a session without saving state** — next session depends on it.
- **Memory files are committed to git** — they are part of the project.
- **Memory is factual** — no speculation, no aspirational content. Document what IS, not what might be.
- **Keep STATE.md under 200 lines** — it must be fast to read. Move history to SESSION_LOG.md.
- **If memory conflicts with reality** (code, git log), reality wins — update memory.
