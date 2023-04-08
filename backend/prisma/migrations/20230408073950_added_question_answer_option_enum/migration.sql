/*
  Warnings:

  - Changed the type of `answer` on the `Answer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AnswerOption" AS ENUM ('YES', 'NO');

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "answer",
ADD COLUMN     "answer" "AnswerOption" NOT NULL;
