-- Add support for structured fee component breakdown and discounts metadata.
ALTER TABLE "fee_items"
ADD COLUMN "meta" JSONB;
