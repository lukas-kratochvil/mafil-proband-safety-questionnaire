/*
  Warnings:

  - You are about to drop the column `additionalInfoId` on the `VisitForm` table. All the data in the column will be lost.
  - Made the column `comment` on table `Answer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `ProbandInfo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `ProbandInfo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "VisitFormState" ADD VALUE 'SENT_TO_MAFILDB';

-- AlterTable
ALTER TABLE "Answer" ALTER COLUMN "comment" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProbandInfo" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- AlterTable
ALTER TABLE "VisitForm" DROP COLUMN "additionalInfoId";
