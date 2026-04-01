/*
  Warnings:

  - You are about to drop the column `status` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `statusId` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "status",
ADD COLUMN     "statusId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "statusId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
