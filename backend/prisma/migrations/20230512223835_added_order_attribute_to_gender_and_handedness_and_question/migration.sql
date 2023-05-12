/*
  Warnings:

  - A unique constraint covering the columns `[order]` on the table `Gender` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order]` on the table `Handedness` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order` to the `Gender` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Handedness` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gender" ADD COLUMN     "order" SMALLINT NOT NULL;

-- AlterTable
ALTER TABLE "Handedness" ADD COLUMN     "order" SMALLINT NOT NULL;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "order" SMALLINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Gender_order_key" ON "Gender"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Handedness_order_key" ON "Handedness"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Question_order_key" ON "Question"("order");
