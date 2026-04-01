/*
  Warnings:

  - You are about to drop the column `materialId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Material` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_materialId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "materialId",
ADD COLUMN     "categoryId" UUID NOT NULL;

-- DropTable
DROP TABLE "Material";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
