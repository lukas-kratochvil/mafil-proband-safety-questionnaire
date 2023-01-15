/*
  Warnings:

  - You are about to drop the column `gender` on the `ProbandInfo` table. All the data in the column will be lost.
  - Added the required column `genderId` to the `ProbandInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProbandInfo" DROP COLUMN "gender",
ADD COLUMN     "genderId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "GenderHiddenQuestion" (
    "id" UUID NOT NULL,
    "genderId" UUID NOT NULL,
    "questionId" UUID NOT NULL,

    CONSTRAINT "GenderHiddenQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gender" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Gender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenderTranslation" (
    "id" UUID NOT NULL,
    "genderId" UUID NOT NULL,
    "languageId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "text" TEXT NOT NULL,

    CONSTRAINT "GenderTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GenderTranslation_genderId_languageId_key" ON "GenderTranslation"("genderId", "languageId");

-- AddForeignKey
ALTER TABLE "ProbandInfo" ADD CONSTRAINT "ProbandInfo_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenderHiddenQuestion" ADD CONSTRAINT "GenderHiddenQuestion_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenderHiddenQuestion" ADD CONSTRAINT "GenderHiddenQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenderTranslation" ADD CONSTRAINT "GenderTranslation_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenderTranslation" ADD CONSTRAINT "GenderTranslation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
