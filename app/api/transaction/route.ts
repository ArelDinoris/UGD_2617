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
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil transaksi' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}