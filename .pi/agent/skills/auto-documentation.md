---
name: auto-documentation
description: Automatically creates, updates, and deletes documentation as code changes. Use this whenever files are created, modified, or deleted to keep docs in sync with the codebase.
---

# Auto Documentation Skill

Keep documentation always in sync with the codebase. Every code change = docs change.

## Instructions

### 1. On File Created
- If it's a **module/service/component**: add entry to the relevant doc (e.g., `docs/api.md`, `docs/components.md`).
- If it's a new **API endpoint**: append to `docs/api.md` with method, path, params, request/response example.
- If it's a new **component**: append to `docs/components.md` with props, usage example, notes.
- If it introduces a **new concept/pattern**: add a section in `docs/architecture.md`.

### 2. On File Modified
- Check if the change affects any documented behavior (function signature, API contract, config).
- If yes, update the corresponding doc section immediately.
- If a function is renamed or its params changed, grep docs for old references and replace.

### 3. On File Deleted
- Remove the corresponding doc entry.
- Grep all `.md` files for dead references to the deleted file and clean them up.
- If removing a feature, note it in the changelog as `removed`.

### 4. README.md Maintenance
- Keep `README.md` project setup instructions accurate.
- If dependencies change (`package.json`, `requirements.txt`, `go.mod`), update install steps.
- If env vars change, update the environment section.

## Doc File Structure
```
docs/
├── api.md              # API endpoints reference
├── architecture.md     # System design & patterns
├── components.md       # UI components catalog
├── deployment.md       # Deploy & infra guide
└── development.md      # Local dev setup & workflows
```

## Constraints
- Documentation must be **Markdown**.
- Use concise language. No filler text.
- Code examples in docs must be **copy-paste runnable**.
- If unsure whether a change affects docs, check — don't skip.
