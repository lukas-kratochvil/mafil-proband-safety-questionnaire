/*
  Warnings:

  - You are about to alter the column `heightCm` on the `VisitForm` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `SmallInt`.
  - You are about to alter the column `weightKg` on the `VisitForm` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `SmallInt`.

*/
-- AlterTable
ALTER TABLE "VisitForm" ALTER COLUMN "heightCm" SET DATA TYPE SMALLINT,
ALTER COLUMN "weightKg" SET DATA TYPE SMALLINT;
