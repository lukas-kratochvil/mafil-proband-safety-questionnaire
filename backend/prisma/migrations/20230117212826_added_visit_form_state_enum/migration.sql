/*
  Warnings:

  - The `state` column on the `VisitForm` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "VisitFormState" AS ENUM ('NEW', 'IN_APPROVAL', 'APPROVED', 'DISAPPROVED', 'FOR_SIGNATURE', 'SIGNED', 'DELETED');

-- AlterTable
ALTER TABLE "VisitForm" DROP COLUMN "state",
ADD COLUMN     "state" "VisitFormState" NOT NULL DEFAULT 'NEW';
