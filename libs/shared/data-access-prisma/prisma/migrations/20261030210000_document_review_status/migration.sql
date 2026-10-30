-- CreateEnum
CREATE TYPE "DocumentReviewStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'VERIFIED', 'REJECTED', 'NEEDS_INFORMATION', 'EXPIRED');

-- AlterTable
ALTER TABLE "documents"
  ADD COLUMN "review_status" "DocumentReviewStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "review_note" TEXT,
  ADD COLUMN "reviewed_at" TIMESTAMP(3),
  ADD COLUMN "reviewed_by_id" TEXT,
  ADD COLUMN "expires_at" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_reviewed_by_id_fkey"
  FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "idx_documents_review_status" ON "documents"("tenant_id", "review_status", "expires_at");
