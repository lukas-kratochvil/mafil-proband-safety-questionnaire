/*
  Warnings:

  - You are about to drop the column `previosQuestionId` on the `Question` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[previousQuestionId]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `previousQuestionId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_previosQuestionId_fkey";

-- DropIndex
DROP INDEX "Question_previosQuestionId_key";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "previosQuestionId",
ADD COLUMN     "previousQuestionId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Question_previousQuestionId_key" ON "Question"("previousQuestionId");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_previousQuestionId_fkey" FOREIGN KEY ("previousQuestionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
