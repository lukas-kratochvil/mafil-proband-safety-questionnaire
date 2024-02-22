/*
  Warnings:

  - You are about to drop the `NativeLanguage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NativeLanguageTranslation` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `nativeLanguageId` on the `VisitForm` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "NativeLanguageTranslation" DROP CONSTRAINT "NativeLanguageTranslation_languageId_fkey";

-- DropForeignKey
ALTER TABLE "NativeLanguageTranslation" DROP CONSTRAINT "NativeLanguageTranslation_nativeLanguageId_fkey";

-- DropForeignKey
ALTER TABLE "VisitForm" DROP CONSTRAINT "VisitForm_nativeLanguageId_fkey";

-- AlterTable
ALTER TABLE "VisitForm" DROP COLUMN "nativeLanguageId",
ADD COLUMN     "nativeLanguageId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "NativeLanguage";

-- DropTable
DROP TABLE "NativeLanguageTranslation";
