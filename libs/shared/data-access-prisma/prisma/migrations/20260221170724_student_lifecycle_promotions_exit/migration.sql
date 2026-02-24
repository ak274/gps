-- CreateEnum
CREATE TYPE "PromotionBatchStatus" AS ENUM ('DRAFT', 'APPLIED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PromotionAction" AS ENUM ('PROMOTE', 'GRADUATE');

-- CreateEnum
CREATE TYPE "PromotionDecision" AS ENUM ('PROMOTE', 'DETAIN', 'GRADUATE', 'EXIT', 'TRANSFER');

-- CreateEnum
CREATE TYPE "ExitReason" AS ENUM ('TRANSFER', 'MIGRATION', 'DROPOUT', 'EXPELLED', 'FEES_UNPAID', 'OTHER');

-- CreateEnum
CREATE TYPE "ExitRequestStatus" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "promotion_batches" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "from_academic_year_id" TEXT NOT NULL,
    "to_academic_year_id" TEXT NOT NULL,
    "status" "PromotionBatchStatus" NOT NULL DEFAULT 'DRAFT',
    "applied_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by_id" TEXT,

    CONSTRAINT "promotion_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_mappings" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "from_class_room_id" TEXT NOT NULL,
    "to_class_room_id" TEXT,
    "action" "PromotionAction" NOT NULL DEFAULT 'PROMOTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by_id" TEXT,

    CONSTRAINT "promotion_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_student_overrides" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "decision" "PromotionDecision" NOT NULL DEFAULT 'PROMOTE',
    "to_class_room_id" TEXT,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by_id" TEXT,

    CONSTRAINT "promotion_student_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_exit_requests" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "status" "ExitRequestStatus" NOT NULL DEFAULT 'REQUESTED',
    "reason" "ExitReason" NOT NULL,
    "forwarding_school_name" TEXT,
    "forwarding_school_address" TEXT,
    "notes" TEXT,
    "decision_notes" TEXT,
    "requested_by_id" TEXT NOT NULL,
    "decided_by_id" TEXT,
    "requested_at" TIMESTAMP(3),
    "decided_at" TIMESTAMP(3),
    "effective_on" DATE,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by_id" TEXT,

    CONSTRAINT "student_exit_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_promotion_batches_tenant_school_status" ON "promotion_batches"("tenant_id", "school_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "uq_promotion_batches_school_year_pair" ON "promotion_batches"("school_id", "from_academic_year_id", "to_academic_year_id");

-- CreateIndex
CREATE INDEX "idx_promotion_mappings_tenant_batch" ON "promotion_mappings"("tenant_id", "batch_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_promotion_mappings_batch_from_classroom" ON "promotion_mappings"("batch_id", "from_class_room_id");

-- CreateIndex
CREATE INDEX "idx_promotion_overrides_tenant_batch" ON "promotion_student_overrides"("tenant_id", "batch_id");

-- CreateIndex
CREATE INDEX "idx_promotion_overrides_student_id" ON "promotion_student_overrides"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_promotion_overrides_batch_student" ON "promotion_student_overrides"("batch_id", "student_id");

-- CreateIndex
CREATE INDEX "idx_student_exit_requests_tenant_school_status" ON "student_exit_requests"("tenant_id", "school_id", "status");

-- CreateIndex
CREATE INDEX "idx_student_exit_requests_student_id" ON "student_exit_requests"("student_id");

-- AddForeignKey
ALTER TABLE "promotion_batches" ADD CONSTRAINT "promotion_batches_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_batches" ADD CONSTRAINT "promotion_batches_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_batches" ADD CONSTRAINT "promotion_batches_from_academic_year_id_fkey" FOREIGN KEY ("from_academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_batches" ADD CONSTRAINT "promotion_batches_to_academic_year_id_fkey" FOREIGN KEY ("to_academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_batches" ADD CONSTRAINT "fk_promotion_batches_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_batches" ADD CONSTRAINT "fk_promotion_batches_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_batches" ADD CONSTRAINT "fk_promotion_batches_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_mappings" ADD CONSTRAINT "promotion_mappings_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_mappings" ADD CONSTRAINT "promotion_mappings_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "promotion_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_mappings" ADD CONSTRAINT "promotion_mappings_from_class_room_id_fkey" FOREIGN KEY ("from_class_room_id") REFERENCES "class_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_mappings" ADD CONSTRAINT "promotion_mappings_to_class_room_id_fkey" FOREIGN KEY ("to_class_room_id") REFERENCES "class_rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_mappings" ADD CONSTRAINT "fk_promotion_mappings_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_mappings" ADD CONSTRAINT "fk_promotion_mappings_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_mappings" ADD CONSTRAINT "fk_promotion_mappings_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_student_overrides" ADD CONSTRAINT "promotion_student_overrides_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_student_overrides" ADD CONSTRAINT "promotion_student_overrides_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "promotion_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_student_overrides" ADD CONSTRAINT "promotion_student_overrides_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_student_overrides" ADD CONSTRAINT "promotion_student_overrides_to_class_room_id_fkey" FOREIGN KEY ("to_class_room_id") REFERENCES "class_rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_student_overrides" ADD CONSTRAINT "fk_promotion_overrides_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_student_overrides" ADD CONSTRAINT "fk_promotion_overrides_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_student_overrides" ADD CONSTRAINT "fk_promotion_overrides_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_exit_requests" ADD CONSTRAINT "student_exit_requests_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_exit_requests" ADD CONSTRAINT "student_exit_requests_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_exit_requests" ADD CONSTRAINT "student_exit_requests_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_exit_requests" ADD CONSTRAINT "student_exit_requests_requested_by_id_fkey" FOREIGN KEY ("requested_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_exit_requests" ADD CONSTRAINT "student_exit_requests_decided_by_id_fkey" FOREIGN KEY ("decided_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_exit_requests" ADD CONSTRAINT "fk_student_exit_requests_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_exit_requests" ADD CONSTRAINT "fk_student_exit_requests_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_exit_requests" ADD CONSTRAINT "fk_student_exit_requests_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
