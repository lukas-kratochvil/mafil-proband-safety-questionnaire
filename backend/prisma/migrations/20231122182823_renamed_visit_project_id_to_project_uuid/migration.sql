/*
  Warnings:

  - You are about to drop the column `projectId` on the `AdditionalVisitFormInfo` table. All the data in the column will be lost.
  - Added the required column `projectUuid` to the `AdditionalVisitFormInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AdditionalVisitFormInfo" DROP COLUMN "projectId",
ADD COLUMN     "projectUuid" VARCHAR(35) NOT NULL;
