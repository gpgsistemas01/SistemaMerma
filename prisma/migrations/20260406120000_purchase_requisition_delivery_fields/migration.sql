ALTER TABLE "PurchaseRequisition"
    ADD COLUMN "deliveryDate" TIMESTAMP(3),
    ADD COLUMN "deliveredById" UUID;

ALTER TABLE "PurchaseRequisition"
    ALTER COLUMN "approverId" DROP NOT NULL;

ALTER TABLE "PurchaseRequisition"
    ADD CONSTRAINT "PurchaseRequisition_deliveredById_fkey"
    FOREIGN KEY ("deliveredById") REFERENCES "Profile"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
