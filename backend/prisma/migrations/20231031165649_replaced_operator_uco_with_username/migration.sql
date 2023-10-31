/*
  Warnings:

  - You are about to drop the column `uco` on the `Operator` table. All the data in the column will be lost.
  - You are about to alter the column `email` on the `Operator` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(320)`.
  - You are about to alter the column `email` on the `VisitForm` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(320)`.
  - You are about to alter the column `phone` on the `VisitForm` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - A unique constraint covering the columns `[username]` on the table `Operator` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `Operator` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Operator_uco_key";

-- AlterTable
ALTER TABLE "Operator" DROP COLUMN "uco",
ADD COLUMN     "username" VARCHAR(255) NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(320);

-- AlterTable
ALTER TABLE "VisitForm" ALTER COLUMN "email" SET DATA TYPE VARCHAR(320),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(50);

-- CreateIndex
CREATE UNIQUE INDEX "Operator_username_key" ON "Operator"("username");
