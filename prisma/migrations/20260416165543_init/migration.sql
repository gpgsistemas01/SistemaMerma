-- CreateEnum
CREATE TYPE "Presentation" AS ENUM ('ROLLO', 'CARTUCHO', 'PIEZA', 'HOJA', 'OJILLOS', 'ML775', 'LT1', 'LT3', 'LT5');

-- CreateTable
CREATE TABLE "Department" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "departmentId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "password" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(200) NOT NULL,
    "sku" VARCHAR(200) NOT NULL,
    "unitCost" DECIMAL(10,2),
    "currentStock" DECIMAL(10,2) NOT NULL,
    "presentation" "Presentation" NOT NULL,
    "unitMeasure" VARCHAR(20) DEFAULT 'PIEZA',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "minStock" DECIMAL(10,2),
    "base" DECIMAL(10,3),
    "height" DECIMAL(10,3),
    "weigthedM2" DECIMAL(10,3),

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weightedM2Records" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "productId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weightedM2" DECIMAL(10,3) NOT NULL,

    CONSTRAINT "weightedM2Records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,
    "numberphone" VARCHAR(20),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "Notification" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(100) NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "type" VARCHAR(20) NOT NULL DEFAULT 'info',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entityId" UUID NOT NULL,
    "entityType" VARCHAR(50) NOT NULL,
    "referenceNumber" VARCHAR(50),
    "userId" UUID,
    "departmentId" UUID,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "referenceNumber" VARCHAR(50) NOT NULL,
    "client" VARCHAR(50) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferenceNumberCounter" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prefix" VARCHAR(10) NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ReferenceNumberCounter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoodsReceipt" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "referenceNumber" VARCHAR(50) NOT NULL,
    "supplierId" UUID NOT NULL,
    "receptionDate" TIMESTAMP(3) NOT NULL,
    "approveDate" TIMESTAMP(3),
    "observations" VARCHAR(50),
    "statusId" UUID NOT NULL,
    "departmentId" UUID NOT NULL,
    "receivedById" UUID NOT NULL,
    "approverId" UUID,

    CONSTRAINT "GoodsReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailGoodsReceiptProduct" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "productId" UUID NOT NULL,
    "goodsReceiptId" UUID NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "detailMovementId" UUID,

    CONSTRAINT "DetailGoodsReceiptProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseRequisition" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "referenceNumber" VARCHAR(50) NOT NULL,
    "approveDate" TIMESTAMP(3),
    "requestDate" TIMESTAMP(3) NOT NULL,
    "deliveryDate" TIMESTAMP(3),
    "observations" VARCHAR(50),
    "statusId" UUID NOT NULL,
    "departmentId" UUID NOT NULL,
    "approverId" UUID,
    "deliveredById" UUID,
    "requesterId" UUID NOT NULL,
    "projectId" UUID NOT NULL,

    CONSTRAINT "PurchaseRequisition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailPurchaseRequisitionProduct" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "productId" UUID NOT NULL,
    "purchaseRequisitionId" UUID NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "DetailPurchaseRequisitionProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoodsIssue" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "referenceNumber" VARCHAR(50) NOT NULL,
    "approvedDate" TIMESTAMP(3),
    "requestDate" TIMESTAMP(3) NOT NULL,
    "deliveryDate" TIMESTAMP(3),
    "observations" VARCHAR(50),
    "statusId" UUID NOT NULL,
    "departmentId" UUID NOT NULL,
    "approverId" UUID,
    "requesterId" UUID NOT NULL,
    "warehouseStaffId" UUID,
    "projectId" UUID NOT NULL,

    CONSTRAINT "GoodsIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailGoodsIssueProduct" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "productId" UUID NOT NULL,
    "goodsIssueId" UUID NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "detailMovementId" UUID,

    CONSTRAINT "DetailGoodsIssueProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryMovement" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "goodsReceiptId" UUID,
    "goodsIssueId" UUID,
    "reasonId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailMovement" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "quantity" DECIMAL(10,2) NOT NULL,
    "movementId" UUID NOT NULL,
    "productId" UUID NOT NULL,

    CONSTRAINT "DetailMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProfileToUser" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_ProfileToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Status_name_key" ON "Status"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_name_key" ON "Supplier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Project_referenceNumber_key" ON "Project"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ReferenceNumberCounter_prefix_key" ON "ReferenceNumberCounter"("prefix");

-- CreateIndex
CREATE UNIQUE INDEX "GoodsReceipt_referenceNumber_key" ON "GoodsReceipt"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DetailGoodsReceiptProduct_detailMovementId_key" ON "DetailGoodsReceiptProduct"("detailMovementId");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseRequisition_referenceNumber_key" ON "PurchaseRequisition"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "GoodsIssue_referenceNumber_key" ON "GoodsIssue"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DetailGoodsIssueProduct_detailMovementId_key" ON "DetailGoodsIssueProduct"("detailMovementId");

-- CreateIndex
CREATE INDEX "_ProfileToUser_B_index" ON "_ProfileToUser"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weightedM2Records" ADD CONSTRAINT "weightedM2Records_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierProduct" ADD CONSTRAINT "SupplierProduct_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierProduct" ADD CONSTRAINT "SupplierProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceipt" ADD CONSTRAINT "GoodsReceipt_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceipt" ADD CONSTRAINT "GoodsReceipt_receivedById_fkey" FOREIGN KEY ("receivedById") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceipt" ADD CONSTRAINT "GoodsReceipt_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceipt" ADD CONSTRAINT "GoodsReceipt_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceipt" ADD CONSTRAINT "GoodsReceipt_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailGoodsReceiptProduct" ADD CONSTRAINT "DetailGoodsReceiptProduct_goodsReceiptId_fkey" FOREIGN KEY ("goodsReceiptId") REFERENCES "GoodsReceipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailGoodsReceiptProduct" ADD CONSTRAINT "DetailGoodsReceiptProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailGoodsReceiptProduct" ADD CONSTRAINT "DetailGoodsReceiptProduct_detailMovementId_fkey" FOREIGN KEY ("detailMovementId") REFERENCES "DetailMovement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequisition" ADD CONSTRAINT "PurchaseRequisition_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequisition" ADD CONSTRAINT "PurchaseRequisition_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequisition" ADD CONSTRAINT "PurchaseRequisition_deliveredById_fkey" FOREIGN KEY ("deliveredById") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequisition" ADD CONSTRAINT "PurchaseRequisition_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequisition" ADD CONSTRAINT "PurchaseRequisition_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequisition" ADD CONSTRAINT "PurchaseRequisition_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPurchaseRequisitionProduct" ADD CONSTRAINT "DetailPurchaseRequisitionProduct_purchaseRequisitionId_fkey" FOREIGN KEY ("purchaseRequisitionId") REFERENCES "PurchaseRequisition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPurchaseRequisitionProduct" ADD CONSTRAINT "DetailPurchaseRequisitionProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsIssue" ADD CONSTRAINT "GoodsIssue_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsIssue" ADD CONSTRAINT "GoodsIssue_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsIssue" ADD CONSTRAINT "GoodsIssue_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsIssue" ADD CONSTRAINT "GoodsIssue_warehouseStaffId_fkey" FOREIGN KEY ("warehouseStaffId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsIssue" ADD CONSTRAINT "GoodsIssue_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsIssue" ADD CONSTRAINT "GoodsIssue_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailGoodsIssueProduct" ADD CONSTRAINT "DetailGoodsIssueProduct_goodsIssueId_fkey" FOREIGN KEY ("goodsIssueId") REFERENCES "GoodsIssue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailGoodsIssueProduct" ADD CONSTRAINT "DetailGoodsIssueProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailGoodsIssueProduct" ADD CONSTRAINT "DetailGoodsIssueProduct_detailMovementId_fkey" FOREIGN KEY ("detailMovementId") REFERENCES "DetailMovement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_goodsReceiptId_fkey" FOREIGN KEY ("goodsReceiptId") REFERENCES "GoodsReceipt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_goodsIssueId_fkey" FOREIGN KEY ("goodsIssueId") REFERENCES "GoodsIssue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailMovement" ADD CONSTRAINT "DetailMovement_movementId_fkey" FOREIGN KEY ("movementId") REFERENCES "InventoryMovement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailMovement" ADD CONSTRAINT "DetailMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToUser" ADD CONSTRAINT "_ProfileToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToUser" ADD CONSTRAINT "_ProfileToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
