/*
  Warnings:

  - You are about to drop the column `weigthedM2` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `weightedM2Records` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "weightedM2Records" DROP CONSTRAINT "weightedM2Records_productId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "weigthedM2",
ADD COLUMN     "totalWaste" DECIMAL(10,3);

-- DropTable
DROP TABLE "weightedM2Records";

-- CreateTable
CREATE TABLE "Waste" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "productId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weightedM2" DECIMAL(10,3) NOT NULL,

    CONSTRAINT "Waste_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Waste" ADD CONSTRAINT "Waste_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
