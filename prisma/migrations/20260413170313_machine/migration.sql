/*
  Warnings:

  - You are about to drop the column `description` on the `DetailGoodsIssueProduct` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `DetailGoodsReceiptProduct` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `DetailPurchaseRequisitionProduct` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Notification_isRead_createdAt_idx";

-- AlterTable
ALTER TABLE "DetailGoodsIssueProduct" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "DetailGoodsReceiptProduct" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "DetailPurchaseRequisitionProduct" DROP COLUMN "description";

-- CreateTable
CREATE TABLE "SupplierProduct" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "price" DECIMAL(10,2) NOT NULL,
    "sku" VARCHAR(50),
    "supplierId" UUID NOT NULL,
    "productId" UUID NOT NULL,

    CONSTRAINT "SupplierProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Machine" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,
    "dailyProductionCapacity" DECIMAL(10,2),

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicator" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,
    "unit" VARCHAR(20) NOT NULL,

    CONSTRAINT "indicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicator_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "indicatorId" UUID NOT NULL,
    "profileId" UUID,
    "userId" UUID,
    "value" DECIMAL(10,2) NOT NULL,
    "period" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "indicator_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndicatorDepartment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "indicatorId" UUID NOT NULL,
    "departmentId" UUID NOT NULL,

    CONSTRAINT "IndicatorDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shift" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,
    "hours" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Period" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Period_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Machine_name_key" ON "Machine"("name");

-- CreateIndex
CREATE UNIQUE INDEX "indicator_name_key" ON "indicator"("name");

-- CreateIndex
CREATE UNIQUE INDEX "indicator_logs_indicatorId_profileId_period_key" ON "indicator_logs"("indicatorId", "profileId", "period");

-- CreateIndex
CREATE UNIQUE INDEX "IndicatorDepartment_indicatorId_departmentId_key" ON "IndicatorDepartment"("indicatorId", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Shift_name_key" ON "Shift"("name");

-- AddForeignKey
ALTER TABLE "SupplierProduct" ADD CONSTRAINT "SupplierProduct_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierProduct" ADD CONSTRAINT "SupplierProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_logs" ADD CONSTRAINT "indicator_logs_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_logs" ADD CONSTRAINT "indicator_logs_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_logs" ADD CONSTRAINT "indicator_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndicatorDepartment" ADD CONSTRAINT "IndicatorDepartment_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndicatorDepartment" ADD CONSTRAINT "IndicatorDepartment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
