ALTER TABLE "PurchaseRequisition"
RENAME COLUMN "authDate" TO "approveDate";

ALTER TABLE "GoodsReceipt"
ADD COLUMN "approveDate" TIMESTAMP(3),
ADD COLUMN "approverId" UUID;

ALTER TABLE "GoodsReceipt"
ADD CONSTRAINT "GoodsReceipt_approverId_fkey"
FOREIGN KEY ("approverId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
