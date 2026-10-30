-- AlterTable
ALTER TABLE "documents" ADD COLUMN "school_id" TEXT;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_school_id_fkey"
  FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "idx_documents_review_expiry" ON "documents"("tenant_id", "school_id", "review_status", "expires_at");
