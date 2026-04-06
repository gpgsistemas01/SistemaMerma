-- CreateTable
CREATE TABLE "GoodsIssue" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "referenceNumber" VARCHAR(50) NOT NULL,
    "authDate" TIMESTAMP(3),
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
    "description" VARCHAR(50),

    CONSTRAINT "DetailGoodsIssueProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GoodsIssue_referenceNumber_key" ON "GoodsIssue"("referenceNumber");

-- AddForeignKey
ALTER TABLE "GoodsIssue" ADD CONSTRAINT "GoodsIssue_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsIssue" ADD CONSTRAINT "GoodsIssue_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsIssue" ADD CONSTRAINT "GoodsIssue_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsIssue" ADD CONSTRAINT "GoodsIssue_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsIssue" ADD CONSTRAINT "GoodsIssue_warehouseStaffId_fkey" FOREIGN KEY ("warehouseStaffId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsIssue" ADD CONSTRAINT "GoodsIssue_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailGoodsIssueProduct" ADD CONSTRAINT "DetailGoodsIssueProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailGoodsIssueProduct" ADD CONSTRAINT "DetailGoodsIssueProduct_goodsIssueId_fkey" FOREIGN KEY ("goodsIssueId") REFERENCES "GoodsIssue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
