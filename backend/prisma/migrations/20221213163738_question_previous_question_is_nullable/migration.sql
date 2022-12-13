-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_previousQuestionId_fkey";

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "previousQuestionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_previousQuestionId_fkey" FOREIGN KEY ("previousQuestionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
