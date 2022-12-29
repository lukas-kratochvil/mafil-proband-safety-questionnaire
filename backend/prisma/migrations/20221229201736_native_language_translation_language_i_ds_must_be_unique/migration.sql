/*
  Warnings:

  - A unique constraint covering the columns `[nativeLanguageId,languageId]` on the table `NativeLanguageTranslation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NativeLanguageTranslation_nativeLanguageId_languageId_key" ON "NativeLanguageTranslation"("nativeLanguageId", "languageId");
