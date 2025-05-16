import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const totalProducts = await prisma.produk.count();

    const transactions = await prisma.transaksi.findMany({
      select: {
        produkId: true,
        jumlah_beli: true,
        total_harga: true,
      },
    });

    // Tambahkan tipe pada 'sum' dan 'trx'
    const totalRevenue = transactions.reduce((sum: number, trx: { total_harga: number }) => {
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

    const mostSoldProduct = await prisma.produk.findUnique({
      where: { id: mostSoldProductId },
    });

    return NextResponse.json({
      totalProducts,
      totalRevenue,
      mostSoldProduct,
      totalQuantitySold: mostSoldQuantity,
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
