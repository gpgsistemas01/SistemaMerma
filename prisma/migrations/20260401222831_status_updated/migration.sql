/*
  Warnings:

  - You are about to drop the column `statusId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_statusId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_statusId_fkey";

-- DropForeignKey
ALTER TABLE "Supplier" DROP CONSTRAINT "Supplier_statusId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_statusId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "statusId",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "statusId",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "statusId",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "statusId",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
