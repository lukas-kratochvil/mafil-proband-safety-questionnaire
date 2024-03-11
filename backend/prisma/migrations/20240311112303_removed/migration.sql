/*
  Warnings:

  - You are about to drop the column `deviceName` on the `AdditionalVisitFormInfo` table. All the data in the column will be lost.
  - You are about to drop the column `projectAcronym` on the `AdditionalVisitFormInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AdditionalVisitFormInfo" DROP COLUMN "deviceName",
DROP COLUMN "projectAcronym";
