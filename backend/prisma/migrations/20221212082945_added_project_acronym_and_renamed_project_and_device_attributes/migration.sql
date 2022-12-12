/*
  Warnings:

  - You are about to drop the column `device` on the `AdditionalVisitFormInfo` table. All the data in the column will be lost.
  - You are about to drop the column `project` on the `AdditionalVisitFormInfo` table. All the data in the column will be lost.
  - You are about to drop the column `additionalVisitFormInfoId` on the `VisitForm` table. All the data in the column will be lost.
  - Added the required column `deviceName` to the `AdditionalVisitFormInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectName` to the `AdditionalVisitFormInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AdditionalVisitFormInfo" DROP COLUMN "device",
DROP COLUMN "project",
ADD COLUMN     "deviceName" VARCHAR(200) NOT NULL,
ADD COLUMN     "projectName" VARCHAR(200) NOT NULL;

-- AlterTable
ALTER TABLE "VisitForm" DROP COLUMN "additionalVisitFormInfoId",
ADD COLUMN     "additionalInfoId" UUID;
