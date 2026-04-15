/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `expiryDate` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `maxStock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `presentation` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `thickness` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `uomId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UoM` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `uniteMeasure` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Made the column `sku` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UnitMeasure" AS ENUM ('ROLLO', 'CARTUCHO', 'PIEZA', 'HOJA', 'ML775', 'LT1', 'LT3', 'LT5');

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_uomId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "categoryId",
DROP COLUMN "color",
DROP COLUMN "expiryDate",
DROP COLUMN "maxStock",
DROP COLUMN "presentation",
DROP COLUMN "thickness",
DROP COLUMN "type",
DROP COLUMN "uomId",
ADD COLUMN     "unitMeasure" "UnitMeasure" NOT NULL,
ALTER COLUMN "sku" SET NOT NULL,
ALTER COLUMN "unitCost" DROP NOT NULL,
ALTER COLUMN "currentStock" DROP NOT NULL,
ALTER COLUMN "minStock" DROP NOT NULL;

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "UoM";

-- CreateTable
CREATE TABLE "weightedM2Records" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "productId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weightedM2" DECIMAL(10,3) NOT NULL,

    CONSTRAINT "weightedM2Records_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "weightedM2Records" ADD CONSTRAINT "weightedM2Records_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
