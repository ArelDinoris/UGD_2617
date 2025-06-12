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

    // Validasi setiap transaksi
    for (const trx of transactions) {
      if (!trx.produkId || !trx.customer || !trx.jumlah_beli || !trx.total_harga || !trx.metode_bayar || !trx.total_bayar || !trx.status) {
        return NextResponse.json(
          { error: 'All required fields (produkId, customer, jumlah_beli, total_harga, metode_bayar, total_bayar, status) must be provided' },
          { status: 400 }
        );
      }

      const product = await prisma.produk.findUnique({
        where: { id: parseInt(trx.produkId) },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${trx.produkId} not found` },
          { status: 404 }
        );
      }

      if (product.stok !== null && product.stok !== undefined && parseInt(trx.jumlah_beli) > product.stok) {
        return NextResponse.json(
          { error: `Insufficient stock for product ID ${trx.produkId}. Available: ${product.stok}, Requested: ${trx.jumlah_beli}` },
          { status: 400 }
        );
      }

      if (parseInt(trx.jumlah_beli) <= 0 || parseInt(trx.total_harga) < 0 || parseInt(trx.total_bayar) < 0 || parseInt(trx.total_kembalian) < 0) {
        return NextResponse.json(
          { error: 'Quantity, total price, payment, and change must be positive numbers' },
          { status: 400 }
        );
      }
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

    // Update stock setelah transaksi berhasil
    for (const trx of transactions) {
      await prisma.produk.update({
        where: { id: parseInt(trx.produkId) },
        data: { stok: { decrement: parseInt(trx.jumlah_beli) } },
      });
    }

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