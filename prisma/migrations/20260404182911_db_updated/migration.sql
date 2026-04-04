/*
  Warnings:

  - You are about to alter the column `name` on the `Department` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to drop the column `length` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `maximunStock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `minimunStock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `voltage` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Product` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `sku` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `unitCost` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `currentStock` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `thickness` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,3)`.
  - You are about to alter the column `color` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `type` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `presentation` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `name` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `lastName` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `name` on the `Role` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `name` on the `Supplier` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `numberphone` on the `Supplier` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `name` on the `UoM` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `abbrevation` on the `UoM` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - Added the required column `maxStock` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minStock` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Department" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "length",
DROP COLUMN "maximunStock",
DROP COLUMN "minimunStock",
DROP COLUMN "voltage",
DROP COLUMN "width",
ADD COLUMN     "base" DECIMAL(10,3),
ADD COLUMN     "height" DECIMAL(10,3),
ADD COLUMN     "maxStock" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "minStock" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "sku" DROP NOT NULL,
ALTER COLUMN "sku" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "unitCost" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "currentStock" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "expiryDate" DROP NOT NULL,
ALTER COLUMN "thickness" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "color" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "type" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "presentation" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Supplier" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "numberphone" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "UoM" ALTER COLUMN "name" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "abbrevation" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(50);
