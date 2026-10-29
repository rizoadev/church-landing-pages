# Business Process Documentation

> Living document. Updated when business logic changes.

## Core Flows

<!-- Step-by-step business processes. Add flows as they're implemented. -->

### Flow: [Example — User Registration]
```
1. User fills registration form (email, password, name)
2. System validates input (email format, password strength)
3. System checks email uniqueness
4. System creates user record (status: PENDING_VERIFICATION)
5. System sends verification email
6. User clicks verification link
7. System activates account (status: ACTIVE)
```

## State Machines

<!-- Object lifecycle states and transitions -->

### [Example — User Account States]
```
PENDING_VERIFICATION → ACTIVE → SUSPENDED → ACTIVE
                              → DELETED (soft)
```

## Business Rules

<!-- If X then Y rules -->
| # | Rule | Condition | Action |
|---|------|-----------|--------|
| — | — | — | — |

## Glossary

<!-- Domain-specific terms and definitions -->
| Term | Definition |
|------|-----------|
| — | — |
