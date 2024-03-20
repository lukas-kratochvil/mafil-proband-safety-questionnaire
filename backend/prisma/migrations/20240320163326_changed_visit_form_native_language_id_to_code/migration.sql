/*
  Warnings:

  - You are about to drop the column `nativeLanguageId` on the `VisitForm` table. All the data in the column will be lost.
  - Added the required column `nativeLanguageCode` to the `VisitForm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VisitForm" DROP COLUMN "nativeLanguageId",
ADD COLUMN     "nativeLanguageCode" TEXT NOT NULL;
