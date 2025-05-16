const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const transactions = [
    {
      produkId: 1, // Asumsi ID 1 = Airpod dari seed.js
      customer: 'Arel Dinoris',
      tanggal: new Date('2025-04-01'),
      jumlah_beli: 1,
      warna: 'white',
      total_harga: 500000,
      metode_bayar: 'QRIS',
      total_bayar: 500000,
      total_kembalian: 0,
      status: 'Done',
    },
    {
      produkId: 2, // Asumsi ID 2 = Headphone dari seed.js
      customer: 'Budi Santoso',
      tanggal: new Date('2025-04-02'),
      jumlah_beli: 2,
      warna: 'black',
      total_harga: 1000000,
      metode_bayar: 'Tunai',
      total_bayar: 1000000,
      total_kembalian: 0,
      status: 'Pending',
    },
    {
      produkId: 3, // Asumsi ID 3 = Speaker dari seed.js
      customer: 'Citra Lestari',
      tanggal: new Date('2025-04-03'),
      jumlah_beli: 1,
      warna: 'blue',
      total_harga: 750000,
      metode_bayar: 'Transfer',
      total_bayar: 750000,
      total_kembalian: 0,
      status: 'Done',
    },
    {
      produkId: 1, // Airpod lagi
      customer: 'Dewi Sartika',
      tanggal: new Date('2025-04-04'),
      jumlah_beli: 1,
      warna: 'white',
      total_harga: 500000,
      metode_bayar: 'QRIS',
      total_bayar: 500000,
      total_kembalian: 0,
      status: 'Pending',
    },
    {
      produkId: 2, // Headphone lagi
      customer: 'Eko Prasetyo',
      tanggal: new Date('2025-04-05'),
      jumlah_beli: 1,
      warna: 'black',
      total_harga: 500000,
      metode_bayar: 'Tunai',
      total_bayar: 500000,
      total_kembalian: 0,
      status: 'Done',
    },
  ];

  // Hapus transaksi lama untuk memastikan hanya 5 transaksi dummy
  await prisma.transaksi.deleteMany();

  // Tambahkan transaksi baru
  for (const transaction of transactions) {
    await prisma.transaksi.create({
      data: transaction,
    });
  }

  console.log('5 transaksi dummy berhasil ditambahkan!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });