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

### Payments
- `GET /api/billing/payments` (`billing.payments.read`)
- `POST /api/billing/payments` (`billing.payments.write`)
- `PATCH /api/billing/payments/:paymentId` (`billing.payments.write`)

## Design Notes

- Every operation is tenant-scoped using JWT `tenantId`.
- Soft-deleted rows are excluded.
- Decimal fields use Prisma Decimal to avoid floating-point errors.
- Fee plan item pricing supports:
  - flat amount
  - attribute-based amount breakdown (`attributes[]`) aggregated into base amount
  - optional per-item discount (`PERCENTAGE` or `FIXED`)
- Fee item pricing metadata is persisted in `fee_items.meta` for auditability.
- Payment creation supports optional invoice allocations.
- Invoice balance/status is recalculated after allocations:
  - `PAID` when balance is zero
  - `PARTIAL` when partially allocated
  - `ISSUED` otherwise
- DTO validation and Swagger docs are included for all routes.
