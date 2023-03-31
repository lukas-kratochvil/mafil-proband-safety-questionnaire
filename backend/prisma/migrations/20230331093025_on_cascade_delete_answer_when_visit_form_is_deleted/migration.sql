-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_visitFormId_fkey";

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_visitFormId_fkey" FOREIGN KEY ("visitFormId") REFERENCES "VisitForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
