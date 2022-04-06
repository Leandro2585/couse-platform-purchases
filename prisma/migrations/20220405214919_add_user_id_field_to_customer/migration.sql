/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `tb_customer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tb_customer" ADD COLUMN     "user_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "tb_customer_user_id_key" ON "tb_customer"("user_id");
