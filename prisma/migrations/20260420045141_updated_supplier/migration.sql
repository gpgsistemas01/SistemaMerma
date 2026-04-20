/*
  Warnings:

  - You are about to drop the column `name` on the `Supplier` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `legalName` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tradeName` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Supplier_name_key";

-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "name",
ADD COLUMN     "code" VARCHAR(10) NOT NULL,
ADD COLUMN     "legalName" VARCHAR(200) NOT NULL,
ADD COLUMN     "tradeName" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "SupplierProduct" ALTER COLUMN "price" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_code_key" ON "Supplier"("code");
