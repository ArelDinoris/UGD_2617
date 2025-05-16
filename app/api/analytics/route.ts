import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const totalProducts = await prisma.produk.count();
    const transactions = await prisma.transaksi.findMany();
    const totalRevenue = transactions.reduce((sum, trx) => sum + trx.total_harga, 0);

    const sales = await prisma.transaksi.groupBy({
      by: ['produkId'],
      _sum: { jumlah_beli: true },
    });

    let mostSold = sales.reduce((max, curr) => (curr._sum.jumlah_beli ?? 0) > (max._sum.jumlah_beli ?? 0) ? curr : max, { produkId: 0, _sum: { jumlah_beli: 0 } });

    const mostSoldProduct = await prisma.produk.findUnique({ where: { id: mostSold.produkId } });

    return NextResponse.json({
      totalProducts,
      totalRevenue,
      mostSoldProduct,
      totalQuantitySold: mostSold._sum.jumlah_beli ?? 0,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}