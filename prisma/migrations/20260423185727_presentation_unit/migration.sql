/*
  Warnings:

  - You are about to drop the column `presentation` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `totalWaste` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `unitMeasure` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Waste` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `convertedQuantity` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `presentationId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitCost` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitMasureId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Waste" DROP CONSTRAINT "Waste_productId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "presentation",
DROP COLUMN "totalWaste",
DROP COLUMN "unitMeasure",
ADD COLUMN     "convertedQuantity" DECIMAL(10,3) NOT NULL,
ADD COLUMN     "presentationId" UUID NOT NULL,
ADD COLUMN     "unitCost" DECIMAL(10,3) NOT NULL,
ADD COLUMN     "unitMasureId" UUID NOT NULL,
ALTER COLUMN "sku" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Supplier" ALTER COLUMN "codeNumber" DROP DEFAULT;

-- DropTable
DROP TABLE "Waste";

-- DropEnum
DROP TYPE "Presentation";

-- CreateTable
CREATE TABLE "UnitMeasure" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(20) NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,

    CONSTRAINT "UnitMeasure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Presentation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Presentation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UnitMeasure_name_symbol_key" ON "UnitMeasure"("name", "symbol");

-- CreateIndex
CREATE UNIQUE INDEX "Presentation_name_key" ON "Presentation"("name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_presentationId_fkey" FOREIGN KEY ("presentationId") REFERENCES "Presentation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_unitMasureId_fkey" FOREIGN KEY ("unitMasureId") REFERENCES "UnitMeasure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
