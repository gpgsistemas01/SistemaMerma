/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Reason` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reason_name_key" ON "Reason"("name");
