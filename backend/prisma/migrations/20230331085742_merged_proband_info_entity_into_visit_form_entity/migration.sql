/*
  Warnings:

  - You are about to drop the column `probandInfoId` on the `VisitForm` table. All the data in the column will be lost.
  - You are about to drop the `ProbandInfo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `birthdate` to the `VisitForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genderId` to the `VisitForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `handednessId` to the `VisitForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `heightCm` to the `VisitForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `VisitForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nativeLanguageId` to the `VisitForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personalId` to the `VisitForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `VisitForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visualCorrectionDioptre` to the `VisitForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weightKg` to the `VisitForm` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AdditionalVisitFormInfo" DROP CONSTRAINT "AdditionalVisitFormInfo_visitFormId_fkey";

-- DropForeignKey
ALTER TABLE "GenderHiddenQuestion" DROP CONSTRAINT "GenderHiddenQuestion_genderCode_fkey";

-- DropForeignKey
ALTER TABLE "GenderHiddenQuestion" DROP CONSTRAINT "GenderHiddenQuestion_questionId_fkey";

-- DropForeignKey
ALTER TABLE "GenderTranslation" DROP CONSTRAINT "GenderTranslation_genderId_fkey";

-- DropForeignKey
ALTER TABLE "HandednessTranslation" DROP CONSTRAINT "HandednessTranslation_handednessId_fkey";

-- DropForeignKey
ALTER TABLE "NativeLanguageTranslation" DROP CONSTRAINT "NativeLanguageTranslation_nativeLanguageId_fkey";

-- DropForeignKey
ALTER TABLE "ProbandInfo" DROP CONSTRAINT "ProbandInfo_genderId_fkey";

-- DropForeignKey
ALTER TABLE "ProbandInfo" DROP CONSTRAINT "ProbandInfo_handednessId_fkey";

-- DropForeignKey
ALTER TABLE "ProbandInfo" DROP CONSTRAINT "ProbandInfo_nativeLanguageId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionTranslation" DROP CONSTRAINT "QuestionTranslation_questionId_fkey";

-- DropForeignKey
ALTER TABLE "VisitForm" DROP CONSTRAINT "VisitForm_probandInfoId_fkey";

-- AlterTable
ALTER TABLE "VisitForm" DROP COLUMN "probandInfoId",
ADD COLUMN     "birthdate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "genderId" UUID NOT NULL,
ADD COLUMN     "handednessId" UUID NOT NULL,
ADD COLUMN     "heightCm" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "name" VARCHAR(200) NOT NULL,
ADD COLUMN     "nativeLanguageId" UUID NOT NULL,
ADD COLUMN     "personalId" VARCHAR(50) NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "surname" VARCHAR(200) NOT NULL,
ADD COLUMN     "visualCorrectionDioptre" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "weightKg" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "ProbandInfo";

-- AddForeignKey
ALTER TABLE "VisitForm" ADD CONSTRAINT "VisitForm_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitForm" ADD CONSTRAINT "VisitForm_handednessId_fkey" FOREIGN KEY ("handednessId") REFERENCES "Handedness"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitForm" ADD CONSTRAINT "VisitForm_nativeLanguageId_fkey" FOREIGN KEY ("nativeLanguageId") REFERENCES "NativeLanguage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalVisitFormInfo" ADD CONSTRAINT "AdditionalVisitFormInfo_visitFormId_fkey" FOREIGN KEY ("visitFormId") REFERENCES "VisitForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionTranslation" ADD CONSTRAINT "QuestionTranslation_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenderHiddenQuestion" ADD CONSTRAINT "GenderHiddenQuestion_genderCode_fkey" FOREIGN KEY ("genderCode") REFERENCES "Gender"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenderHiddenQuestion" ADD CONSTRAINT "GenderHiddenQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenderTranslation" ADD CONSTRAINT "GenderTranslation_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HandednessTranslation" ADD CONSTRAINT "HandednessTranslation_handednessId_fkey" FOREIGN KEY ("handednessId") REFERENCES "Handedness"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NativeLanguageTranslation" ADD CONSTRAINT "NativeLanguageTranslation_nativeLanguageId_fkey" FOREIGN KEY ("nativeLanguageId") REFERENCES "NativeLanguage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
