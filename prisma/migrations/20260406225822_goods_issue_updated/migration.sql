/*
  Warnings:

  - You are about to drop the column `authDate` on the `GoodsIssue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GoodsIssue" DROP COLUMN "authDate",
ADD COLUMN     "approvedDate" TIMESTAMP(3);
