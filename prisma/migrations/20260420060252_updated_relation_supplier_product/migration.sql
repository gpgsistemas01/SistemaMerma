/*
  Warnings:

  - A unique constraint covering the columns `[supplierId,productId]` on the table `SupplierProduct` will be added. If there are existing duplicate values, this will fail.
  - Made the column `sku` on table `SupplierProduct` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "SupplierProduct" ALTER COLUMN "sku" SET NOT NULL;

-- CreateIndex
CREATE INDEX "SupplierProduct_supplierId_idx" ON "SupplierProduct"("supplierId");

-- CreateIndex
CREATE INDEX "SupplierProduct_productId_idx" ON "SupplierProduct"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierProduct_supplierId_productId_key" ON "SupplierProduct"("supplierId", "productId");
