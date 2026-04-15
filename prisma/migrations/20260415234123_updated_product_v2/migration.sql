/*
  Warnings:

  - Made the column `currentStock` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "weigthedM2" DECIMAL(10,3),
ALTER COLUMN "currentStock" SET NOT NULL;
