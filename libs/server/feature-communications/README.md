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

### Notification preferences

- `GET /api/communications/notifications/preferences` (`communications.notifications.read`) returns the current user’s event/channel matrix with safe defaults.
- `POST /api/communications/notifications/preferences` (`communications.notifications.write`) updates one event/channel preference and audits the change.
- Supported channels are `IN_APP`, `EMAIL`, `SMS` and `WHATSAPP`; provider delivery remains a separate integration concern.
- Message listing is restricted to current user's inbox/sent/all views.
- Recipient membership is validated before sending direct messages.
- DTO validation and Swagger docs are included for all routes.
