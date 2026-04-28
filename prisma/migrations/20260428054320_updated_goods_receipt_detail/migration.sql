/*
  Warnings:

  - You are about to drop the column `area` on the `GoodsReceiptDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GoodsReceiptDetail" DROP COLUMN "area",
ALTER COLUMN "totalArea" DROP NOT NULL;
