/*
  Warnings:

  - You are about to alter the column `nativeLanguageCode` on the `VisitForm` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(5)`.

*/
-- AlterTable
ALTER TABLE "VisitForm" ALTER COLUMN "nativeLanguageCode" SET DATA TYPE VARCHAR(5);
