# @gps/feature-communications

Communications domain APIs for tenant-scoped notifications and direct messaging.

## Endpoints

### Notifications
- `GET /api/communications/notifications` (`communications.notifications.read`)
- `POST /api/communications/notifications` (`communications.notifications.write`)
- `POST /api/communications/notifications/:notificationId/read` (`communications.notifications.read`)

### Messages
- `GET /api/communications/messages` (`communications.messages.read`)
- `POST /api/communications/messages` (`communications.messages.write`)

## Design Notes

- All data access is tenant-scoped via JWT `tenantId`.
- Soft-deleted rows are excluded.
- Notification create supports recipient seeding via `user_notifications`.
- Notification read marks are per-user (`user_notifications` upsert).
- Message listing is restricted to current user's inbox/sent/all views.
- Recipient membership is validated before sending direct messages.
- DTO validation and Swagger docs are included for all routes.
