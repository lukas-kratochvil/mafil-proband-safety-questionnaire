/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Handedness` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `NativeLanguage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Handedness` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `NativeLanguage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Handedness" ADD COLUMN     "code" VARCHAR(2) NOT NULL;

-- AlterTable
ALTER TABLE "NativeLanguage" ADD COLUMN     "code" VARCHAR(2) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Handedness_code_key" ON "Handedness"("code");

-- CreateIndex
CREATE UNIQUE INDEX "NativeLanguage_code_key" ON "NativeLanguage"("code");
