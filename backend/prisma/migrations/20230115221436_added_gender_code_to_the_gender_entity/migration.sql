/*
  Warnings:

  - You are about to drop the column `genderId` on the `GenderHiddenQuestion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Gender` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[genderCode,questionId]` on the table `GenderHiddenQuestion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Gender` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genderCode` to the `GenderHiddenQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GenderHiddenQuestion" DROP CONSTRAINT "GenderHiddenQuestion_genderId_fkey";

-- AlterTable
ALTER TABLE "Gender" ADD COLUMN     "code" VARCHAR(1) NOT NULL;

-- AlterTable
ALTER TABLE "GenderHiddenQuestion" DROP COLUMN "genderId",
ADD COLUMN     "genderCode" VARCHAR(1) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Gender_code_key" ON "Gender"("code");

-- CreateIndex
CREATE UNIQUE INDEX "GenderHiddenQuestion_genderCode_questionId_key" ON "GenderHiddenQuestion"("genderCode", "questionId");

-- AddForeignKey
ALTER TABLE "GenderHiddenQuestion" ADD CONSTRAINT "GenderHiddenQuestion_genderCode_fkey" FOREIGN KEY ("genderCode") REFERENCES "Gender"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
