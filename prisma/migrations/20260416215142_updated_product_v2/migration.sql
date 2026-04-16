/*
  Warnings:

  - Made the column `unitCost` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `unitMeasure` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalWaste` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "unitCost" SET NOT NULL,
ALTER COLUMN "unitCost" SET DEFAULT 0,
ALTER COLUMN "currentStock" SET DEFAULT 0,
ALTER COLUMN "presentation" SET DEFAULT 'PIEZA',
ALTER COLUMN "unitMeasure" SET NOT NULL,
ALTER COLUMN "minStock" SET NOT NULL,
ALTER COLUMN "minStock" SET DEFAULT 0,
ALTER COLUMN "totalWaste" SET NOT NULL,
ALTER COLUMN "totalWaste" SET DEFAULT 0;
