/*
  Warnings:

  - You are about to drop the column `approvedAt` on the `AdditionalVisitFormInfo` table. All the data in the column will be lost.
  - You are about to drop the column `approverId` on the `AdditionalVisitFormInfo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdditionalVisitFormInfo" DROP CONSTRAINT "AdditionalVisitFormInfo_approverId_fkey";

-- AlterTable
ALTER TABLE "AdditionalVisitFormInfo" DROP COLUMN "approvedAt",
DROP COLUMN "approverId";
