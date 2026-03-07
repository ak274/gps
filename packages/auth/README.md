# @gps/auth

Generic, reusable frontend auth package for the monorepo.

## Includes

- `AuthProvider` and `useAuth` for session lifecycle.
- API adapter (`createAuthApi`) for `/api/auth` endpoints.
- ABAC policy support (`canAccess`).
- Three guard shapes:
  - component guard: `Guard`
  - hook guard: `useGuard`
  - util guard: `canGuard`
- Redirect hooks:
  - `useRequireAuth`
  - `useRequireGuest`
- `authFetch` from `useAuth()`:
  - sends bearer token automatically
  - retries once on `401` after refresh
  - clears session if refresh/retry fails

## Notes

- Runtime parsing uses `safeParse` in production and strict `parse` in development.
- This package is feature-agnostic and intended to be consumed by app feature libs.
