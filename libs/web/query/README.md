# @gps/web-query

React Query setup shared across web apps.

## What belongs here

- `createQueryClient()` baseline defaults (retry behavior, stale times, etc.).
- `AppQueryProvider` that mounts React Query (and devtools in dev).

## What does not belong here

- Domain query keys and API hooks (those go in feature/data-access libs).
