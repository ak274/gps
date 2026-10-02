# @gps/feature-billing

Billing domain APIs for fee plans, invoices, and payments.

## Endpoints

### Fee Plans
- `GET /api/billing/fee-plans` (`billing.feePlans.read`)
- `POST /api/billing/fee-plans` (`billing.feePlans.write`)
- `PATCH /api/billing/fee-plans/:feePlanId` (`billing.feePlans.write`)

### Invoices
- `GET /api/billing/invoices` (`billing.invoices.read`)
- `POST /api/billing/invoices` (`billing.invoices.write`)
- `PATCH /api/billing/invoices/:invoiceId` (`billing.invoices.write`)
- `GET /api/billing/schedules?schoolId=...` (`billing.invoices.read`)
- `POST /api/billing/schedules` (`billing.invoices.write`)
- `POST /api/billing/schedules/run` (`billing.invoices.write`) — safe worker/cron entry point for due schedules
- `POST /api/billing/invoices/generate` (`billing.invoices.write`)
- `POST /api/billing/invoices/:invoiceId/deliver` (`billing.invoices.write`)
- `POST /api/billing/reminders/run` (`billing.invoices.write`)
- `GET /api/billing/students/:studentId/ledger` (`billing.invoices.read`)

### Flexible assignments and adjustments
- `GET /api/billing/assignments?schoolId=...` (`billing.feePlans.read`)
- `POST /api/billing/assignments/classes` (`billing.feePlans.write`)
- `POST /api/billing/assignments/students` (`billing.feePlans.write`)
- `POST /api/billing/adjustments` (`billing.feePlans.write`)

### Payments
- `GET /api/billing/payments` (`billing.payments.read`)
- `POST /api/billing/payments` (`billing.payments.write`)
- `PATCH /api/billing/payments/:paymentId` (`billing.payments.write`)
- `GET /api/billing/payments/:paymentId/receipt` (`billing.payments.read`) — print-ready HTML receipt

## Design Notes

- Every operation is tenant-scoped using JWT `tenantId`.
- Soft-deleted rows are excluded.
- Decimal fields use Prisma Decimal to avoid floating-point errors.
- Fee plan item pricing supports:
  - flat amount
  - attribute-based amount breakdown (`attributes[]`) aggregated into base amount
  - optional per-item discount (`PERCENTAGE` or `FIXED`)
- Fee item pricing metadata is persisted in `fee_items.meta` for auditability.
- Fee plans support monthly, quarterly, annual and one-time billing cycles.
- Plans can be assigned to a class or directly to a student; student scope is the natural override layer.
- Charges and discounts can target a class or student with their own billing cycle and reason.
- Payment creation supports optional invoice allocations.
- Recurring schedules generate invoices idempotently per student and billing period.
- Generated invoices include applicable class/student adjustments and active family sibling benefits as visible invoice lines.
- Delivery records distinguish portal publication from queued email delivery; this keeps provider integration auditable.
- Reminder runs queue due and overdue invoice reminders without duplicating a reminder for the same invoice/channel/run date.
- Student ledgers are derived from invoices and completed payments so the running balance cannot drift from financial records.
- Invoice balance/status is recalculated after allocations:
  - `PAID` when balance is zero
  - `PARTIAL` when partially allocated
  - `ISSUED` otherwise
- DTO validation and Swagger docs are included for all routes.
