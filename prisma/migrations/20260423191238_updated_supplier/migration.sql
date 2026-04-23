/*
  Warnings:

  - You are about to drop the column `numberphone` on the `Supplier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "numberphone";

-- AlterTable
ALTER TABLE "SupplierProduct" ALTER COLUMN "sku" DROP NOT NULL;
