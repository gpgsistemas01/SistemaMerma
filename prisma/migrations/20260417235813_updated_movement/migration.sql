/*
  Warnings:

  - You are about to drop the column `goodsIssueId` on the `InventoryMovement` table. All the data in the column will be lost.
  - You are about to drop the column `goodsReceiptId` on the `InventoryMovement` table. All the data in the column will be lost.
  - You are about to drop the column `reasonId` on the `InventoryMovement` table. All the data in the column will be lost.
  - You are about to drop the `DetailGoodsIssueProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DetailGoodsReceiptProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DetailMovement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DetailPurchaseRequisitionProduct` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `movementType` to the `InventoryMovement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenceId` to the `InventoryMovement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenceType` to the `InventoryMovement` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReferenceType" AS ENUM ('GOODS_RECEIPT', 'PURCHASE_REQUISITION', 'GOODS_ISSUE', 'OTHER');

-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('IN', 'OUT');

-- CreateEnum
CREATE TYPE "ReferenceDetailType" AS ENUM ('GOODS_RECEIPT_DETAIL', 'PURCHASE_REQUISITION_DETAIL', 'GOODS_ISSUE_DETAIL', 'OTHER');

-- DropForeignKey
ALTER TABLE "DetailGoodsIssueProduct" DROP CONSTRAINT "DetailGoodsIssueProduct_detailMovementId_fkey";

-- DropForeignKey
ALTER TABLE "DetailGoodsIssueProduct" DROP CONSTRAINT "DetailGoodsIssueProduct_goodsIssueId_fkey";

-- DropForeignKey
ALTER TABLE "DetailGoodsIssueProduct" DROP CONSTRAINT "DetailGoodsIssueProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "DetailGoodsReceiptProduct" DROP CONSTRAINT "DetailGoodsReceiptProduct_detailMovementId_fkey";

-- DropForeignKey
ALTER TABLE "DetailGoodsReceiptProduct" DROP CONSTRAINT "DetailGoodsReceiptProduct_goodsReceiptId_fkey";

-- DropForeignKey
ALTER TABLE "DetailGoodsReceiptProduct" DROP CONSTRAINT "DetailGoodsReceiptProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "DetailMovement" DROP CONSTRAINT "DetailMovement_movementId_fkey";

-- DropForeignKey
ALTER TABLE "DetailMovement" DROP CONSTRAINT "DetailMovement_productId_fkey";

-- DropForeignKey
ALTER TABLE "DetailPurchaseRequisitionProduct" DROP CONSTRAINT "DetailPurchaseRequisitionProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "DetailPurchaseRequisitionProduct" DROP CONSTRAINT "DetailPurchaseRequisitionProduct_purchaseRequisitionId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryMovement" DROP CONSTRAINT "InventoryMovement_goodsIssueId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryMovement" DROP CONSTRAINT "InventoryMovement_goodsReceiptId_fkey";

-- AlterTable
ALTER TABLE "InventoryMovement" DROP COLUMN "goodsIssueId",
DROP COLUMN "goodsReceiptId",
DROP COLUMN "reasonId",
ADD COLUMN     "movementType" "MovementType" NOT NULL,
ADD COLUMN     "referenceId" UUID NOT NULL,
ADD COLUMN     "referenceType" "ReferenceType" NOT NULL;

-- DropTable
DROP TABLE "DetailGoodsIssueProduct";

-- DropTable
DROP TABLE "DetailGoodsReceiptProduct";

-- DropTable
DROP TABLE "DetailMovement";

-- DropTable
DROP TABLE "DetailPurchaseRequisitionProduct";

-- CreateTable
CREATE TABLE "GoodsReceiptDetail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "productId" UUID NOT NULL,
    "goodsReceiptId" UUID NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "GoodsReceiptDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseRequisitionDetail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "productId" UUID NOT NULL,
    "purchaseRequisitionId" UUID NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "PurchaseRequisitionDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoodsIssueDetail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "productId" UUID NOT NULL,
    "goodsIssueId" UUID NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "GoodsIssueDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovementDetail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "quantity" DECIMAL(10,2) NOT NULL,
    "movementId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "referenceDetailId" UUID,
    "referenceDetailType" "ReferenceDetailType",

    CONSTRAINT "MovementDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GoodsReceiptDetail" ADD CONSTRAINT "GoodsReceiptDetail_goodsReceiptId_fkey" FOREIGN KEY ("goodsReceiptId") REFERENCES "GoodsReceipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptDetail" ADD CONSTRAINT "GoodsReceiptDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequisitionDetail" ADD CONSTRAINT "PurchaseRequisitionDetail_purchaseRequisitionId_fkey" FOREIGN KEY ("purchaseRequisitionId") REFERENCES "PurchaseRequisition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequisitionDetail" ADD CONSTRAINT "PurchaseRequisitionDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsIssueDetail" ADD CONSTRAINT "GoodsIssueDetail_goodsIssueId_fkey" FOREIGN KEY ("goodsIssueId") REFERENCES "GoodsIssue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsIssueDetail" ADD CONSTRAINT "GoodsIssueDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovementDetail" ADD CONSTRAINT "MovementDetail_movementId_fkey" FOREIGN KEY ("movementId") REFERENCES "InventoryMovement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovementDetail" ADD CONSTRAINT "MovementDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
