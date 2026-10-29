---
name: changelog-manager
description: Maintains a structured CHANGELOG.md following Keep a Changelog format with semantic versioning. Use this after every feature, fix, or breaking change is completed.
---

# Changelog Manager Skill

Maintain a clean, structured changelog that follows [Keep a Changelog](https://keepachangelog.com/) and [Semantic Versioning](https://semver.org/).

## Instructions

### 1. File Location
- Changelog lives at `CHANGELOG.md` in project root.
- If it doesn't exist, create it with this header:
  ```markdown
  # Changelog

  All notable changes to this project will be documented in this file.

  The format is based on [Keep a Changelog](https://keepachangelog.com/),
  and this project adheres to [Semantic Versioning](https://semver.org/).

  ## [Unreleased]
  ```

### 2. Entry Format
Every entry goes under `## [Unreleased]` first, categorized by:

| Category | When to Use |
|----------|-------------|
| `Added` | New features |
| `Changed` | Changes in existing functionality |
| `Deprecated` | Soon-to-be removed features |
| `Removed` | Now removed features |
| `Fixed` | Bug fixes |
| `Security` | Vulnerability fixes |

Entry format:
```markdown
### Added
- Description of what was added. ([#issue-number])
```

### 3. Releasing a Version
When the user says "release" or "bump version":
1. Determine version bump type:
   - **MAJOR** (x.0.0): breaking changes
   - **MINOR** (0.x.0): new features, backward compatible
   - **PATCH** (0.0.x): bug fixes only
2. Move `[Unreleased]` entries under a new version header:
   ```markdown
   ## [1.2.0] - 2026-10-28
   ```
3. Create a fresh empty `## [Unreleased]` section above it.
4. Update version references in `package.json`, `pyproject.toml`, `go.mod`, etc.

### 4. Link References
At the bottom of the changelog, maintain compare links:
```markdown
[Unreleased]: https://github.com/user/repo/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/user/repo/compare/v1.1.0...v1.2.0
```

## Constraints
- Never delete previous version entries.
- Entries must be human-readable — no commit hashes or technical jargon.
- One line per change. Be specific but concise.
- Always keep `[Unreleased]` section at the top even if empty.
