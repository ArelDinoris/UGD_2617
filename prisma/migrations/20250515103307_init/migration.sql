-- CreateTable
CREATE TABLE "Produk" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,
    "stok" INTEGER NOT NULL,
    "warna" TEXT NOT NULL,
    "foto" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,

    CONSTRAINT "Produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaksi" (
    "id" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "produkId" INTEGER NOT NULL,
    "customer" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jumlah_beli" INTEGER NOT NULL,
    "warna" TEXT NOT NULL,
    "total_harga" INTEGER NOT NULL,
    "metode_bayar" TEXT NOT NULL,
    "total_bayar" INTEGER NOT NULL,
    "total_kembalian" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Transaksi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaksi_orderId_key" ON "Transaksi"("orderId");

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
