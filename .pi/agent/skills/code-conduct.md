---
name: code-conduct
description: Enforces strict coding standards, linting rules, and code quality practices. Use this on every code change to ensure consistency and quality across the codebase.
---

# Strict Code Conduct Skill

Enforce consistent, clean, maintainable code across the entire project.

## Instructions

### 1. Naming Conventions
- **Files**: kebab-case (`user-service.ts`, `auth-handler.py`, `order_repo.go`)
- **Variables/Functions**: camelCase (JS/TS), snake_case (Python/Go)
- **Classes/Types**: PascalCase
- **Constants**: UPPER_SNAKE_CASE
- **Boolean vars**: prefix with `is`, `has`, `can`, `should` (e.g., `isActive`, `hasPermission`)
- **No abbreviations** unless universally understood (`id`, `url`, `api` are fine; `usr`, `mgr`, `btn` are not)

### 2. Function Rules
- Max **30 lines** per function. If longer, extract.
- Max **4 parameters**. If more, use an options/config object.
- Single Responsibility — one function does one thing.
- Always have explicit return types (TypeScript/Go).
- No nested callbacks deeper than **2 levels**.

### 3. File Structure
- Max **300 lines** per file. If longer, split into modules.
- Imports at the top, grouped: stdlib → third-party → local.
- One component/class per file.
- No dead code — delete it, don't comment it out.

### 4. Error Handling
- Never swallow errors silently (`catch {}` with empty body).
- Always log or propagate with context.
- Use custom error classes/types for domain errors.
- API endpoints must return consistent error format:
  ```json
  { "error": { "code": "NOT_FOUND", "message": "User not found" } }
  ```

### 5. Comments & Documentation
- **No obvious comments** (`// increment i` — useless).
- **Do comment** the "why", not the "what".
- All public functions/methods must have JSDoc/docstring/godoc.
- TODO format: `// TODO(author): description — issue-link`

### 6. Security
- No hardcoded secrets, passwords, or API keys.
- Sanitize all user inputs.
- Use parameterized queries — never string-concatenate SQL.
- Validate and type-check API request payloads.

## Constraints
- Enforce these rules on every code generation and review.
- If existing code violates these rules, flag it but don't refactor unsolicited — ask first.
- When in doubt, prefer readability over cleverness.
