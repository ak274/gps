# GPS Understanding

GPS is a school management application implemented as a pnpm Nx monorepo. The current workspace has three application surfaces, shared web and server libraries, Prisma-backed data access, infrastructure tasks, and e2e test projects.

This summary was generated from the resolved Nx project graph plus the deterministic repository scan in `.understand-anything/intermediate/scan-result.json`.

## System Shape

- `@gps/api` in `apps/api` is the NestJS API. It composes the server feature libraries and exposes Swagger locally at `/api/docs`.
- `portal` in `apps/portal` is the main React portal application. It composes web feature libraries, shared auth, HTTP access, query, router, and UI packages.
- `@gps/gps` in `apps/gps` is another web app project currently present in the workspace graph but not wired to other internal projects.
- `@gps/api-e2e` and `portal-e2e` are e2e projects linked to the API and portal respectively.
- `infra` in `tools/infra` owns local infrastructure tasks such as the Postgres Docker flow.

## Backend Composition

The API app depends on these server-side feature modules:

- `@gps/feature-academics`
- `@gps/feature-admissions`
- `@gps/feature-attendance`
- `@gps/feature-auth`
- `@gps/feature-billing`
- `@gps/feature-communications`
- `@gps/feature-documents`
- `@gps/feature-exams`
- `@gps/feature-guardians`
- `@gps/feature-homework`
- `@gps/feature-rbac`
- `@gps/feature-schools`
- `@gps/feature-staff`
- `@gps/feature-student-lifecycle`
- `@gps/feature-students`
- `@gps/feature-tenants`
- `@gps/feature-timetable`
- `@gps/feature-transport`

Most server features share a consistent dependency pattern:

- They depend on `@gps/data-access-db` for database access.
- They depend on `@gps/data-access-prisma` for Prisma integration and generated client access.
- They depend on `@gps/feature-auth` when protected API behavior needs authenticated context.
- They depend on `@gps/server-errors` for shared server error handling.

## Frontend Composition

The portal app depends on these web modules:

- `@gps/web-feature-auth`
- `@gps/web-feature-attendance`
- `@gps/web-feature-classes`
- `@gps/web-feature-students`
- `@gps/web-feature-teachers`
- `@gps/web-data-access-http`
- `@gps/web-query`
- `@gps/web-router`
- `@gps/web-ui`
- `@gps/auth`

The repeated web feature pattern is:

- Feature packages call APIs through `@gps/web-data-access-http`.
- Shared auth state and behavior lives in `@gps/auth` and `@gps/web-auth`.
- Shared visual building blocks live in `@gps/web-ui`.
- Query and routing concerns are separated into `@gps/web-query` and `@gps/web-router`.

## Data Layer

The data layer has two main projects:

- `@gps/data-access-db` in `libs/shared/data-access-db`
- `@gps/data-access-prisma` in `libs/shared/data-access-prisma`

`@gps/data-access-prisma` owns Prisma commands such as `generate`, `migrate-dev`, `migrate-deploy`, `db-push`, `studio`, `format`, and `seed`. It also depends on the generated Prisma client project under `libs/shared/data-access-prisma/src/generated/client`.

## Local Development Flow

The README defines this API startup path:

```sh
pnpm nx run infra:db-up
pnpm nx run @gps/data-access-prisma:migrate-dev
pnpm nx run @gps/data-access-prisma:generate
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/gps?schema=public" \
JWT_SECRET="dev_secret_dev_secret_dev_secret" \
pnpm nx run @gps/api:serve
```

## Generated Understanding Artifacts

- `.understand-anything/knowledge-graph.json` contains a dashboard-compatible graph with Nx projects as nodes and Nx dependencies as edges.
- `.understand-anything/meta.json` records the git commit and scan timestamp.
- `.understand-anything/intermediate/nx-graph.json` contains the raw resolved Nx graph used for this summary.
- `.understand-anything/intermediate/scan-result.json` contains the deterministic file inventory.
- `.understand-anything/intermediate/batches.json` contains semantic batches prepared by the understand-anything scanner.

## Useful Nx Queries

```sh
pnpm nx show projects --json
pnpm nx show project @gps/api --json
pnpm nx show project portal --json
pnpm nx graph --print
```
