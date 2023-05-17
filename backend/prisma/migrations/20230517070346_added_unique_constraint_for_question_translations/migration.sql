/*
  Warnings:

  - A unique constraint covering the columns `[questionId,languageId]` on the table `QuestionTranslation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "QuestionTranslation_questionId_languageId_key" ON "QuestionTranslation"("questionId", "languageId");
