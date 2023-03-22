/*
  Warnings:

  - The values [APPROVED,DISAPPROVED,FOR_SIGNATURE,SIGNED] on the enum `VisitFormState` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VisitFormState_new" AS ENUM ('NEW', 'IN_APPROVAL', 'DELETED');
ALTER TABLE "VisitForm" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "VisitForm" ALTER COLUMN "state" TYPE "VisitFormState_new" USING ("state"::text::"VisitFormState_new");
ALTER TYPE "VisitFormState" RENAME TO "VisitFormState_old";
ALTER TYPE "VisitFormState_new" RENAME TO "VisitFormState";
DROP TYPE "VisitFormState_old";
ALTER TABLE "VisitForm" ALTER COLUMN "state" SET DEFAULT 'NEW';
COMMIT;
