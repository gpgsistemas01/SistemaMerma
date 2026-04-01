/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "categoryId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "unitCost" DECIMAL(65,30) NOT NULL,
    "currentStock" DECIMAL(65,30) NOT NULL,
    "minimunStock" DECIMAL(65,30) NOT NULL,
    "maximunStock" DECIMAL(65,30) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "width" DECIMAL(65,30) NOT NULL,
    "length" DECIMAL(65,30) NOT NULL,
    "thickness" DECIMAL(65,30) NOT NULL,
    "color" TEXT NOT NULL,
    "voltage" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "presentation" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "uomId" UUID NOT NULL,
    "materialId" UUID NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UoM" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "abbrevation" TEXT NOT NULL,

    CONSTRAINT "UoM_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UoM_name_key" ON "UoM"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UoM_abbrevation_key" ON "UoM"("abbrevation");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_uomId_fkey" FOREIGN KEY ("uomId") REFERENCES "UoM"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;