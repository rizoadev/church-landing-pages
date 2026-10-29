---
name: worktree-rules
description: Enforces git worktree and branching workflow rules. Use this when creating branches, switching context, or managing parallel workstreams.
---

# Worktree Rules Skill

Enforce clean git branching strategy and worktree discipline.

## Instructions

### 1. Branch Naming
| Branch | Purpose | Format |
|--------|---------|--------|
| `main` | Production-ready code | Protected, never commit directly |
| `dev` | Integration branch | Merge target for features |
| `feat/<name>` | New feature | `feat/add-user-auth` |
| `fix/<name>` | Bug fix | `fix/login-redirect-loop` |
| `hotfix/<name>` | Urgent prod fix | `hotfix/payment-crash` |
| `chore/<name>` | Maintenance task | `chore/update-deps` |
| `docs/<name>` | Documentation only | `docs/api-reference` |
| `refactor/<name>` | Code restructure | `refactor/service-layer` |

### 2. Branch Lifecycle
1. **Create** from `dev` (or `main` for hotfix):
   ```bash
   git checkout dev && git pull
   git checkout -b feat/my-feature
   ```
2. **Work** — commit frequently with conventional commits.
3. **Push** — `git push -u origin feat/my-feature`
4. **PR/MR** — target `dev`. Include description, linked issue, test evidence.
5. **Merge** — squash merge preferred. Delete branch after merge.
6. **Release** — `dev` → `main` via release branch or direct merge.

### 3. Worktree Usage
For parallel workstreams without stashing:
```bash
# Add worktree for a feature
git worktree add ../project-feat-auth feat/add-user-auth

# List active worktrees
git worktree list

# Remove when done
git worktree remove ../project-feat-auth
```

### 4. Commit Discipline
- Commit after every logical unit of work (not at end of day).
- Never commit broken code to `dev` or `main`.
- Never commit `.env`, `node_modules/`, `__pycache__/`, build artifacts.
- Interactive rebase to clean up before PR: `git rebase -i dev`

### 5. Conflict Resolution
- Always `git pull --rebase` before pushing.
- Resolve conflicts manually — never auto-accept incoming or current blindly.
- After resolving, re-run tests before committing.

## Constraints
- Never force push to `main` or `dev`.
- Never commit directly to `main` — always through PR.
- Branch must have at least 1 commit with meaningful message before PR.
- Stale branches (>14 days no activity) should be flagged for cleanup.
