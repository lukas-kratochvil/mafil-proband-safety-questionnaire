/*
  Warnings:

  - You are about to drop the column `locale` on the `Language` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Language` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Language` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Language_locale_key";

-- AlterTable
ALTER TABLE "Language" DROP COLUMN "locale",
ADD COLUMN     "code" VARCHAR(5) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Language_code_key" ON "Language"("code");
