CREATE TABLE IF NOT EXISTS "tasks" (
  "id" text PRIMARY KEY,
  "tenant_id" text NOT NULL,
  "school_id" text NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "type" text NOT NULL DEFAULT 'MANUAL',
  "status" text NOT NULL DEFAULT 'OPEN',
  "priority" text NOT NULL DEFAULT 'NORMAL',
  "assignee_id" text,
  "created_by_id" text NOT NULL,
  "completed_by_id" text,
  "source_type" text,
  "source_id" text,
  "action_url" text,
  "due_at" timestamp(3),
  "completed_at" timestamp(3),
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" timestamp(3),
  CONSTRAINT "fk_tasks_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_tasks_school_id" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_tasks_assignee_id" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE SET NULL,
  CONSTRAINT "fk_tasks_created_by_id" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT,
  CONSTRAINT "fk_tasks_completed_by_id" FOREIGN KEY ("completed_by_id") REFERENCES "users"("id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "task_reminders" (
  "id" text PRIMARY KEY,
  "tenant_id" text NOT NULL,
  "task_id" text NOT NULL,
  "user_id" text NOT NULL,
  "remind_at" timestamp(3) NOT NULL,
  "sent_at" timestamp(3),
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_task_reminders_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_task_reminders_task_id" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_task_reminders_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_tasks_school_status_due" ON "tasks" ("tenant_id", "school_id", "status", "due_at");
CREATE INDEX IF NOT EXISTS "idx_tasks_assignee_status_due" ON "tasks" ("tenant_id", "assignee_id", "status", "due_at");
CREATE INDEX IF NOT EXISTS "idx_tasks_source" ON "tasks" ("source_type", "source_id");
CREATE INDEX IF NOT EXISTS "idx_task_reminders_due" ON "task_reminders" ("tenant_id", "user_id", "sent_at", "remind_at");
