const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.produk.createMany({
    data: [
      {
        nama: 'Airpod',
        harga: 500000,
        stok: 10,
        warna: 'white',
        foto: '/airbuds.png',
      },
      {
        nama: 'Headphone',
        harga: 500000,
        stok: 10,
        warna: 'black',
        foto: '/headphone.png',
      },
      {
        nama: 'Headset',
        harga: 200000,
        stok: 5,
        warna: 'white',
        foto: '/earphone.png',
      },
      {
        nama: 'Accessories',
        harga: 50000,
        stok: 15,
        warna: 'black',
        foto: '/airpods.png',
      },
    ],
  });
}

main()
  .then(() => {
    console.log('Database seeded');
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(() => {
    prisma.$disconnect();
  });
