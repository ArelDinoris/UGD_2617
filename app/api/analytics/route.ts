import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// Definisikan interface untuk transaksi
interface Transaction {
  produkId: number;
  jumlah_beli: number;
  total_harga: number;
}

export async function GET() {
  try {
    // Hitung total produk
    const totalProducts = await prisma.produk.count();

    // Ambil data transaksi dengan tipe eksplisit
    const transactions = await prisma.transaksi.findMany({
      select: {
        produkId: true,
        jumlah_beli: true,
        total_harga: true,
      },
    }) as Transaction[];

    // Hitung total pendapatan
    const totalRevenue = transactions.reduce((sum: number, trx: Transaction) => {
      return sum + trx.total_harga;
    }, 0);

    // Hitung total jumlah_beli per produkId
    const salesMap: Record<number, number> = {};
    for (const trx of transactions) {
      salesMap[trx.produkId] = (salesMap[trx.produkId] || 0) + trx.jumlah_beli;
    }

    // Cari produkId dengan jumlah jual terbanyak
    let mostSoldProductId = 0;
    let mostSoldQuantity = 0;

    for (const [produkIdStr, quantity] of Object.entries(salesMap)) {
      const produkId = parseInt(produkIdStr);
      if (quantity > mostSoldQuantity) {
        mostSoldProductId = produkId;
        mostSoldQuantity = quantity;
      }
    }

    // Ambil detail produk terlaris, tangani jika tidak ada produk terlaris
    const mostSoldProduct = mostSoldProductId
      ? await prisma.produk.findUnique({
          where: { id: mostSoldProductId },
        })
      : null;

    // Kembalikan respons JSON
    return NextResponse.json({
      totalProducts,
      totalRevenue,
      mostSoldProduct: mostSoldProduct || null,
      totalQuantitySold: mostSoldQuantity,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data analytics' },
      { status: 500 },
    );
  }
}