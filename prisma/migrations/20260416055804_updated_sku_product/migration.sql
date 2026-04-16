/*
  Warnings:

  - A unique constraint covering the columns `[sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Product_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- AlterEnum
ALTER TYPE "UnitMeasure" ADD VALUE 'OJILLOS';
