/*
  Warnings:

  - You are about to drop the column `orderId` on the `Transaksi` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Transaksi_orderId_key";

-- AlterTable
ALTER TABLE "Transaksi" DROP COLUMN "orderId";

-- CreateTable
CREATE TABLE "OrderSequence" (
    "id" SERIAL NOT NULL,
    "lastOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "OrderSequence_pkey" PRIMARY KEY ("id")
);
