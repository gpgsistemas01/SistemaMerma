-- CreateTable
CREATE TABLE "ReferenceNumberCounter" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prefix" VARCHAR(10) NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ReferenceNumberCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReferenceNumberCounter_prefix_key" ON "ReferenceNumberCounter"("prefix");
