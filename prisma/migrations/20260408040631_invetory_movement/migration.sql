/*
  Warnings:

  - A unique constraint covering the columns `[detailMovementId]` on the table `DetailGoodsIssueProduct` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[detailMovementId]` on the table `DetailGoodsReceiptProduct` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `detailMovementId` to the `DetailGoodsIssueProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detailMovementId` to the `DetailGoodsReceiptProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DetailGoodsIssueProduct" ADD COLUMN     "detailMovementId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "DetailGoodsReceiptProduct" ADD COLUMN     "detailMovementId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Reason" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Reason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryMovement" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "goodsReceiptId" UUID,
    "goodsIssueId" UUID,
    "reasonId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailMovement" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "quantity" DECIMAL(10,2) NOT NULL,
    "movementId" UUID NOT NULL,
    "productId" UUID NOT NULL,

    CONSTRAINT "DetailMovement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DetailGoodsIssueProduct_detailMovementId_key" ON "DetailGoodsIssueProduct"("detailMovementId");

-- CreateIndex
CREATE UNIQUE INDEX "DetailGoodsReceiptProduct_detailMovementId_key" ON "DetailGoodsReceiptProduct"("detailMovementId");

-- AddForeignKey
ALTER TABLE "DetailGoodsReceiptProduct" ADD CONSTRAINT "DetailGoodsReceiptProduct_detailMovementId_fkey" FOREIGN KEY ("detailMovementId") REFERENCES "DetailMovement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailGoodsIssueProduct" ADD CONSTRAINT "DetailGoodsIssueProduct_detailMovementId_fkey" FOREIGN KEY ("detailMovementId") REFERENCES "DetailMovement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_goodsReceiptId_fkey" FOREIGN KEY ("goodsReceiptId") REFERENCES "GoodsReceipt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_goodsIssueId_fkey" FOREIGN KEY ("goodsIssueId") REFERENCES "GoodsIssue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_reasonId_fkey" FOREIGN KEY ("reasonId") REFERENCES "Reason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailMovement" ADD CONSTRAINT "DetailMovement_movementId_fkey" FOREIGN KEY ("movementId") REFERENCES "InventoryMovement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailMovement" ADD CONSTRAINT "DetailMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
