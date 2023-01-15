/*
  Warnings:

  - You are about to drop the column `handedness` on the `ProbandInfo` table. All the data in the column will be lost.
  - Added the required column `handednessId` to the `ProbandInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProbandInfo" DROP COLUMN "handedness",
ADD COLUMN     "handednessId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Handedness" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Handedness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HandednessTranslation" (
    "id" UUID NOT NULL,
    "handednessId" UUID NOT NULL,
    "languageId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "text" TEXT NOT NULL,

    CONSTRAINT "HandednessTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HandednessTranslation_handednessId_languageId_key" ON "HandednessTranslation"("handednessId", "languageId");

-- AddForeignKey
ALTER TABLE "ProbandInfo" ADD CONSTRAINT "ProbandInfo_handednessId_fkey" FOREIGN KEY ("handednessId") REFERENCES "Handedness"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HandednessTranslation" ADD CONSTRAINT "HandednessTranslation_handednessId_fkey" FOREIGN KEY ("handednessId") REFERENCES "Handedness"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HandednessTranslation" ADD CONSTRAINT "HandednessTranslation_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
