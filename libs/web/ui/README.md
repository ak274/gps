# @gps/web-ui

Frontend UI primitives and shared styling helpers for all web apps.

## What belongs here

- Reusable UI components (shadcn/ui style).
- Shared styling helpers like `cn(...)`.
- No business logic, no API calls.

## Tailwind v4 + shadcn

- Global design tokens live in `src/styles/globals.css` and are exported as `@gps/web-ui/styles.css`.
- Apps should import it once from their entry CSS (see `apps/portal/src/styles.css`).
- `components.json` is included so `shadcn` CLI can target this workspace in a monorepo.
- Style is set to `base-vega` to prefer Base UI (not Radix) primitives.

## Public API

- `cn(...classes)` merges classnames with Tailwind-aware conflict resolution.
