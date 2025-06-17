import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET single transaction by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid transaction ID' },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaksi.findUnique({
      where: { id },
      include: { produk: true },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT (Update) transaction by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid transaction ID' },
        { status: 400 }
      );
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.produkId || !data.customer || !data.jumlah_beli || !data.total_harga || !data.metode_bayar || !data.status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if transaction exists
    const existingTransaction = await prisma.transaksi.findUnique({
      where: { id },
    });

    if (!existingTransaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Update transaction
    const updatedTransaction = await prisma.transaksi.update({
      where: { id },
      data: {
        produkId: parseInt(data.produkId),
        customer: data.customer,
        jumlah_beli: parseInt(data.jumlah_beli),
        warna: data.warna || 'N/A',
        total_harga: parseInt(data.total_harga),
        metode_bayar: data.metode_bayar,
        total_bayar: parseInt(data.total_bayar || data.total_harga),
        total_kembalian: parseInt(data.total_kembalian || 0),
        status: data.status,
        tanggal: data.tanggal ? new Date(data.tanggal) : existingTransaction.tanggal,
      },
      include: { produk: true },
    });

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE transaction by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid transaction ID' },
        { status: 400 }
      );
    }

    // Check if transaction exists
    const existingTransaction = await prisma.transaksi.findUnique({
      where: { id },
    });

    if (!existingTransaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Delete transaction
    await prisma.transaksi.delete({
      where: { id },
    });

    return NextResponse.json({ 
      message: 'Transaction deleted successfully',
      deletedId: id 
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}