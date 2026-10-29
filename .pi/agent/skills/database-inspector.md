---
name: database-inspector
description: Safely query the local database and provide insights on the current data state. Use this when the user asks about data, records, counts, or anything that requires reading from the database.
---

# Database Inspector Skill

Safely query the local database and provide insights on the current data state.

## Instructions
1. Analyze the user's natural language request to understand the data need.
2. Formulate a valid SQL query.
   - **CRITICAL: Only `SELECT` statements are allowed.** Never run `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`, or any DDL/DML that modifies data.
3. Execute the query using the runner script:
   ```bash
   python scripts/query_runner.py "SELECT ..."
   ```
4. Present the results in a clean Markdown table.

## Constraints
- **Never** output raw user passwords, API keys, tokens, or secrets — mask them (e.g. `sk-****`).
- If the query returns **> 50 rows**, summarize the data (counts, aggregates, top-N) instead of listing everything.
- If the user's request is ambiguous, clarify before running.
- Always double-check the generated SQL before execution.
