/*
  Warnings:

  - You are about to drop the column `langaugeId` on the `NativeLanguageTranslation` table. All the data in the column will be lost.
  - Added the required column `languageId` to the `NativeLanguageTranslation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "NativeLanguageTranslation" DROP CONSTRAINT "NativeLanguageTranslation_langaugeId_fkey";

-- AlterTable
ALTER TABLE "NativeLanguageTranslation" DROP COLUMN "langaugeId",
ADD COLUMN     "languageId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "NativeLanguageTranslation" ADD CONSTRAINT "NativeLanguageTranslation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
