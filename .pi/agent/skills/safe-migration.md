---
name: safe-migration
description: Enforces safe database migration practices. Use this when creating, reviewing, or running database migrations. Prevents destructive operations and protects production data.
---

# Safe Migration Skill

Run database migrations safely. Protect existing data. Never touch production.

## Instructions

### 1. Forbidden Operations
These SQL operations are **BANNED** in migrations unless explicitly approved by the user:

| Operation | Why |
|-----------|-----|
| `DROP TABLE` | Destroys data permanently |
| `DROP COLUMN` | Destroys column data permanently |
| `TRUNCATE` | Wipes all rows |
| `DELETE FROM` (without WHERE) | Wipes all rows |
| `CREATE OR REPLACE` | Silently overwrites existing objects |
| `ALTER TABLE ... DROP` | Destroys column/constraint data |
| `CASCADE` on DROP | Cascading destruction |

### 2. Safe Alternatives

| Instead of | Do this |
|-----------|---------|
| `DROP COLUMN` | `ALTER TABLE ... RENAME COLUMN old TO _old_deprecated` — keep data, mark deprecated |
| `DROP TABLE` | `ALTER TABLE ... RENAME TO _tablename_deprecated` — soft-remove |
| Changing column type | Add new column → backfill data → swap references → deprecate old column |
| `TRUNCATE` | Never. If you need to clear test data, do it in a seed script, not migration |
| `NOT NULL` on existing column | Add with DEFAULT first, backfill, then add constraint |

### 3. Schema Change Workflow
For any migration that affects existing data:

```
1. Generate migration file
2. Review SQL — check for banned operations
3. Estimate impact:
   - How many rows affected?
   - Is there data that will be lost?
   - Is the migration reversible?
4. Create a ROLLBACK migration alongside the UP migration
5. Run on LOCAL/DEV only
6. Verify data integrity after migration
7. Only then merge to dev branch
```

### 4. Major Schema Changes
When a change requires clearing or transforming existing rows:

1. **STOP** — ask the user before proceeding.
2. Present the impact:
   ```
   ⚠️ This migration will affect X rows in table Y.
   - Column Z will be transformed from VARCHAR to INT
   - 15 rows have non-numeric values that will fail
   - Rollback: migration_xxx_down.sql
   ```
3. Suggest a **data migration script** (separate from schema migration):
   - Backup affected data first
   - Transform in batches
   - Validate after each batch
4. Never auto-run major schema changes.

### 5. Migration File Naming
```
migrations/
├── 001_create_users.up.sql
├── 001_create_users.down.sql
├── 002_add_email_to_users.up.sql
├── 002_add_email_to_users.down.sql
└── ...
```
- Sequential numbering or timestamp-based (`20261028120000_`).
- Always create both `up` and `down` files.
- `down` must perfectly reverse `up`.

### 6. Pre-Run Checklist
Before executing any migration:
- [ ] No `DROP`, `TRUNCATE`, `CASCADE`, or `REPLACE` present
- [ ] `down` migration exists and is tested
- [ ] Running against **local/dev** database (NOT production)
- [ ] Current database state is backed up
- [ ] Migration is idempotent (safe to run twice)

## Environment Guard

```bash
# Before running ANY migration, verify target
if [[ "$DATABASE_URL" == *"prod"* ]] || [[ "$DATABASE_URL" == *"production"* ]] || [[ "$NODE_ENV" == "production" ]]; then
  echo "🚫 BLOCKED: Cannot run migrations against production database."
  echo "   Use a separate deployment pipeline for production migrations."
  exit 1
fi
```

## Constraints
- **NEVER** run migrations against production database. No exceptions.
- **NEVER** auto-approve migrations that affect existing data.
- **ALWAYS** generate a rollback/down migration.
- **ALWAYS** show the SQL to the user before executing.
- If ORM generates a migration with `DROP` or destructive ops, rewrite it using safe alternatives.
- Treat every row of existing data as irreplaceable until told otherwise.
