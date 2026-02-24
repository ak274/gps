# @gps/web-auth

Auth state container for web apps (tokens + user) with a small persistence layer.

## What belongs here

- Token storage and parsing (`localStorage`).
- `AuthProvider` + `useAuth()` hook.
- No API calls (those live in data-access libs).

## Notes

- Token parsing uses `zod.safeParse` in production and `zod.parse` in development to catch schema drift early.
