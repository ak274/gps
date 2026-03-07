# @gps/web-feature-auth

Portal auth feature UI built on top of `@gps/auth`.

## Includes

- `LoginPage`
- `SignUpPage`

## Design intent

- Keeps auth UX in a feature library.
- Uses the generic auth package for state, API and ABAC checks.
- Can be reused by other web apps without duplicating auth logic.
- Uses `react-hook-form` + `zodResolver` for form handling.
- Uses shared `@gps/web-ui` shadcn/Base UI components for fields and controls.
