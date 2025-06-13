import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const transactions = await prisma.transaksi.findMany({
      include: { produk: true },
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data transaksi' },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const transactions = await request.json();

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return NextResponse.json(
        { error: 'No transactions provided' },
        { status: 400 }
      );
    }

    const savedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        const { produkId, customer, jumlah_beli, warna, total_harga, metode_bayar, total_bayar, total_kembalian, status, orderId } = transaction;

        if (!produkId || !customer || !jumlah_beli || !total_harga || !metode_bayar || !total_bayar || !total_kembalian || !status) {
          throw new Error('Missing required fields in transaction');
        }

        return await prisma.transaksi.create({
          data: {
            produkId: parseInt(produkId),
            customer,
            jumlah_beli: parseInt(jumlah_beli),
            warna: warna || 'N/A',
            total_harga: parseInt(total_harga),
            metode_bayar,
            total_bayar: parseInt(total_bayar),
            total_kembalian: parseInt(total_kembalian),
            status,
            orderId: orderId || null, // Gunakan orderId dari input atau null jika tidak ada
          },
        });
      })
    );

    return NextResponse.json(savedTransactions, { status: 201 });
  } catch (error: any) {
    console.error('Error saving transactions:', error);
    return NextResponse.json(
      {
        error: 'Gagal menyimpan transaksi',
        details: error.message,
        prismaCode: error.code || null,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}