-- CreateTable
CREATE TABLE "Machine" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,
    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductConsumption" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "referenceNumber" VARCHAR(50) NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL,
    "statusId" UUID NOT NULL,
    "departmentId" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "requesterId" UUID NOT NULL,
    "machineId" UUID NOT NULL,
    CONSTRAINT "ProductConsumption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailProductConsumption" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "productConsumptionId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "goodsIssueId" UUID NOT NULL,
    "consumedSquareMeters" DECIMAL(10, 2) NOT NULL,
    CONSTRAINT "DetailProductConsumption_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Machine_name_key" ON "Machine"("name");
CREATE UNIQUE INDEX "ProductConsumption_referenceNumber_key" ON "ProductConsumption"("referenceNumber");

ALTER TABLE "ProductConsumption" ADD CONSTRAINT "ProductConsumption_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProductConsumption" ADD CONSTRAINT "ProductConsumption_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProductConsumption" ADD CONSTRAINT "ProductConsumption_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProductConsumption" ADD CONSTRAINT "ProductConsumption_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProductConsumption" ADD CONSTRAINT "ProductConsumption_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "DetailProductConsumption" ADD CONSTRAINT "DetailProductConsumption_productConsumptionId_fkey" FOREIGN KEY ("productConsumptionId") REFERENCES "ProductConsumption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DetailProductConsumption" ADD CONSTRAINT "DetailProductConsumption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DetailProductConsumption" ADD CONSTRAINT "DetailProductConsumption_goodsIssueId_fkey" FOREIGN KEY ("goodsIssueId") REFERENCES "GoodsIssue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
