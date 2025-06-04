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
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const transactions = await request.json();
    
    if (!Array.isArray(transactions)) {
      return NextResponse.json(
        { error: 'Request body must be an array of transactions' },
        { status: 400 }
      );
    }

    const createdTransactions = await prisma.$transaction(
      transactions.map((trx) =>
        prisma.transaksi.create({
          data: {
            produkId: parseInt(trx.produkId),
            customer: trx.customer,
            jumlah_beli: parseInt(trx.jumlah_beli),
            warna: trx.warna || 'N/A',
            total_harga: parseInt(trx.total_harga),
            metode_bayar: trx.metode_bayar,
            total_bayar: parseInt(trx.total_bayar),
            total_kembalian: parseInt(trx.total_kembalian),
            status: trx.status,
          },
        })
      )
    );

    return NextResponse.json(createdTransactions, { status: 201 });
  } catch (error) {
    console.error('Error creating transactions:', error);
    return NextResponse.json(
      { error: 'Failed to create transactions' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}