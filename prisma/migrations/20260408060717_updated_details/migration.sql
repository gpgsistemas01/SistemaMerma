-- DropForeignKey
ALTER TABLE "DetailGoodsIssueProduct" DROP CONSTRAINT "DetailGoodsIssueProduct_detailMovementId_fkey";

-- DropForeignKey
ALTER TABLE "DetailGoodsReceiptProduct" DROP CONSTRAINT "DetailGoodsReceiptProduct_detailMovementId_fkey";

-- AlterTable
ALTER TABLE "DetailGoodsIssueProduct" ALTER COLUMN "detailMovementId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "DetailGoodsReceiptProduct" ALTER COLUMN "detailMovementId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DetailGoodsReceiptProduct" ADD CONSTRAINT "DetailGoodsReceiptProduct_detailMovementId_fkey" FOREIGN KEY ("detailMovementId") REFERENCES "DetailMovement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailGoodsIssueProduct" ADD CONSTRAINT "DetailGoodsIssueProduct_detailMovementId_fkey" FOREIGN KEY ("detailMovementId") REFERENCES "DetailMovement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
