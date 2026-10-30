# Workflow tasks and reminders

This feature provides reusable, tenant-scoped work items for school follow-ups, reviews, approvals and other actions that should not disappear into a disconnected list.

## Endpoints

- `GET /api/tasks` (`workflows.tasks.read`) lists tasks with school, status, priority, mine-only and overdue filters.
- `GET /api/tasks/:taskId` (`workflows.tasks.read`) reads one task in the authenticated tenant.
- `POST /api/tasks` (`workflows.tasks.write`) creates a task, validates the school and assignee, optionally schedules a reminder, and creates an in-app notification.
- `PATCH /api/tasks/:taskId/status` (`workflows.tasks.write`) transitions a task and records completion actor/time when completed.
- `POST /api/tasks/:taskId/reminders` (`workflows.tasks.write`) schedules an additional reminder.
- `POST /api/tasks/reminders/run` (`workflows.tasks.write`) processes due reminders idempotently into in-app notifications.

The first slice intentionally uses the existing in-app notification model. External email, SMS and WhatsApp delivery, background scheduling, recurring reminders, snooze/digest policy and source-module adapters remain follow-up work.

## Approval workflows

Approval requests are tenant- and school-scoped, use ordered approvers, and activate one step at a time. A decision on the active step either activates the next approver or completes the request with a recorded outcome and note.

- `GET /api/approvals` (`workflows.approvals.read`) lists approval requests and ordered steps for a school.
- `GET /api/approvals/:requestId` (`workflows.approvals.read`) reads one request with assignee and decision context.
- `POST /api/approvals` (`workflows.approvals.write`) creates a request, validates approvers and creates the first approval task/notification.
- `POST /api/approvals/:requestId/decision` (`workflows.approvals.decide`) records approve, reject or request-changes with a decision note.

The portal approval desk is available at `/app/approvals`. Source-module create flows, configurable rules, attachments/evidence, escalation, external delivery and full audit history remain follow-up work.
