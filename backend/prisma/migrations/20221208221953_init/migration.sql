-- CreateEnum
CREATE TYPE "OperatorRole" AS ENUM ('MR', 'MR_HIGH_PERM');

-- CreateTable
CREATE TABLE "Operator" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" VARCHAR(200) NOT NULL,
    "surname" VARCHAR(200) NOT NULL,
    "uco" VARCHAR(8) NOT NULL,
    "email" TEXT NOT NULL,
    "role" "OperatorRole" NOT NULL DEFAULT 'MR',
    "isValid" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Operator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitForm" (
    "id" UUID NOT NULL,
    "probandInfoId" UUID NOT NULL,
    "probandLanguageId" UUID NOT NULL,
    "additionalVisitFormInfoId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "state" VARCHAR(20) NOT NULL,
    "note" TEXT,
    "visitId" VARCHAR(50),
    "pdf" BYTEA,

    CONSTRAINT "VisitForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdditionalVisitFormInfo" (
    "id" UUID NOT NULL,
    "visitFormId" UUID NOT NULL,
    "finalizerId" UUID NOT NULL,
    "approverId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "projectId" VARCHAR(35) NOT NULL,
    "project" VARCHAR(200) NOT NULL,
    "projectAcronym" VARCHAR(30) NOT NULL,
    "deviceId" VARCHAR(35) NOT NULL,
    "device" VARCHAR(200) NOT NULL,
    "isPhantom" BOOLEAN NOT NULL DEFAULT false,
    "measuredAt" TIMESTAMP(3) NOT NULL,
    "finalizedAt" TIMESTAMP(3) NOT NULL,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "AdditionalVisitFormInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProbandInfo" (
    "id" UUID NOT NULL,
    "nativeLanguageId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" VARCHAR(200) NOT NULL,
    "surname" VARCHAR(200) NOT NULL,
    "personalId" VARCHAR(50) NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "heightCm" DOUBLE PRECISION NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "gender" VARCHAR(10) NOT NULL,
    "visualCorrectionDioptre" DOUBLE PRECISION NOT NULL,
    "handedness" VARCHAR(20) NOT NULL,
    "email" TEXT,
    "phone" TEXT,

    CONSTRAINT "ProbandInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NativeLanguage" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "order" SMALLINT,

    CONSTRAINT "NativeLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NativeLanguageTranslation" (
    "id" UUID NOT NULL,
    "nativeLanguageId" UUID NOT NULL,
    "langaugeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "text" TEXT NOT NULL,

    CONSTRAINT "NativeLanguageTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" UUID NOT NULL,
    "visitFormId" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "answer" VARCHAR(3) NOT NULL,
    "comment" TEXT,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" UUID NOT NULL,
    "previosQuestionId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "partNumber" SMALLINT NOT NULL,
    "mustBeApproved" BOOLEAN NOT NULL,
    "isValid" BOOLEAN NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionTranslation" (
    "id" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "languageId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "text" TEXT NOT NULL,

    CONSTRAINT "QuestionTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" VARCHAR(25) NOT NULL,
    "locale" VARCHAR(5) NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Operator_uco_key" ON "Operator"("uco");

-- CreateIndex
CREATE UNIQUE INDEX "Operator_email_key" ON "Operator"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdditionalVisitFormInfo_visitFormId_key" ON "AdditionalVisitFormInfo"("visitFormId");

-- CreateIndex
CREATE UNIQUE INDEX "NativeLanguage_order_key" ON "NativeLanguage"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Question_previosQuestionId_key" ON "Question"("previosQuestionId");

-- CreateIndex
CREATE UNIQUE INDEX "Language_locale_key" ON "Language"("locale");

-- AddForeignKey
ALTER TABLE "VisitForm" ADD CONSTRAINT "VisitForm_probandInfoId_fkey" FOREIGN KEY ("probandInfoId") REFERENCES "ProbandInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitForm" ADD CONSTRAINT "VisitForm_probandLanguageId_fkey" FOREIGN KEY ("probandLanguageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalVisitFormInfo" ADD CONSTRAINT "AdditionalVisitFormInfo_visitFormId_fkey" FOREIGN KEY ("visitFormId") REFERENCES "VisitForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalVisitFormInfo" ADD CONSTRAINT "AdditionalVisitFormInfo_finalizerId_fkey" FOREIGN KEY ("finalizerId") REFERENCES "Operator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalVisitFormInfo" ADD CONSTRAINT "AdditionalVisitFormInfo_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "Operator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProbandInfo" ADD CONSTRAINT "ProbandInfo_nativeLanguageId_fkey" FOREIGN KEY ("nativeLanguageId") REFERENCES "NativeLanguage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NativeLanguageTranslation" ADD CONSTRAINT "NativeLanguageTranslation_nativeLanguageId_fkey" FOREIGN KEY ("nativeLanguageId") REFERENCES "NativeLanguage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NativeLanguageTranslation" ADD CONSTRAINT "NativeLanguageTranslation_langaugeId_fkey" FOREIGN KEY ("langaugeId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_visitFormId_fkey" FOREIGN KEY ("visitFormId") REFERENCES "VisitForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_previosQuestionId_fkey" FOREIGN KEY ("previosQuestionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionTranslation" ADD CONSTRAINT "QuestionTranslation_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionTranslation" ADD CONSTRAINT "QuestionTranslation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
