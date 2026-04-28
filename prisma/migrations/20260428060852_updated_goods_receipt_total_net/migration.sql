/*
  Warnings:

  - You are about to drop the column `totalnetPurchaseAmount` on the `GoodsReceipt` table. All the data in the column will be lost.
  - Added the required column `totalNetPurchaseAmount` to the `GoodsReceipt` table without a default value. This is not possible if the table is not empty.
  - Made the column `totalArea` on table `GoodsReceiptDetail` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "GoodsReceipt" DROP COLUMN "totalnetPurchaseAmount",
ADD COLUMN     "totalNetPurchaseAmount" DECIMAL(10,3) NOT NULL;

-- AlterTable
ALTER TABLE "GoodsReceiptDetail" ALTER COLUMN "unitCostByArea" DROP NOT NULL,
ALTER COLUMN "totalArea" SET NOT NULL;
