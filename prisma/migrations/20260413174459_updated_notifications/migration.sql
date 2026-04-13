/*
  Warnings:

  - You are about to drop the column `referenceId` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `entityId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityType` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "referenceId",
ADD COLUMN     "departmentId" UUID,
ADD COLUMN     "entityId" UUID NOT NULL,
ADD COLUMN     "entityType" VARCHAR(50) NOT NULL,
ADD COLUMN     "referenceNumber" UUID,
ADD COLUMN     "userId" UUID;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
