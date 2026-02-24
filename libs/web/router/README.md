# @gps/web-router

TanStack Router helpers shared across web apps.

## What belongs here

- Router devtools wrapper used only in development.
- Shared router patterns (later: route guards, typed router context helpers).

## Workspace exports resolution

This workspace uses a custom export condition `@gps/source` to prefer `src/` over `dist/` for internal packages.
Vite apps should include it in `resolve.conditions` (done in `apps/portal/vite.config.mts`).
