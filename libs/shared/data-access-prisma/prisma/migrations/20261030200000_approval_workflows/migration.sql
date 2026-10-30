CREATE TABLE IF NOT EXISTS "approval_requests" (
  "id" text PRIMARY KEY,
  "tenant_id" text NOT NULL,
  "school_id" text NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "status" text NOT NULL DEFAULT 'REQUESTED',
  "entity_type" text NOT NULL,
  "entity_id" text NOT NULL,
  "requested_by_id" text NOT NULL,
  "due_at" timestamp(3),
  "completed_at" timestamp(3),
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" timestamp(3),
  CONSTRAINT "fk_approval_requests_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_approval_requests_school_id" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_approval_requests_requested_by_id" FOREIGN KEY ("requested_by_id") REFERENCES "users"("id") ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS "approval_steps" (
  "id" text PRIMARY KEY,
  "approval_request_id" text NOT NULL,
  "sequence" integer NOT NULL,
  "assignee_id" text NOT NULL,
  "status" text NOT NULL DEFAULT 'PENDING',
  "decision_note" text,
  "decided_at" timestamp(3),
  "decided_by_id" text,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_approval_steps_request_id" FOREIGN KEY ("approval_request_id") REFERENCES "approval_requests"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_approval_steps_assignee_id" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE RESTRICT,
  CONSTRAINT "fk_approval_steps_decided_by_id" FOREIGN KEY ("decided_by_id") REFERENCES "users"("id") ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "uq_approval_steps_request_sequence" ON "approval_steps" ("approval_request_id", "sequence");
CREATE INDEX IF NOT EXISTS "idx_approval_requests_school_status" ON "approval_requests" ("tenant_id", "school_id", "status", "due_at");
CREATE INDEX IF NOT EXISTS "idx_approval_requests_entity" ON "approval_requests" ("tenant_id", "entity_type", "entity_id");
CREATE INDEX IF NOT EXISTS "idx_approval_steps_assignee_status" ON "approval_steps" ("assignee_id", "status");
