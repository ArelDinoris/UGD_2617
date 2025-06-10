import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { nama, harga, stok } = body;

    if (!nama || !harga || !stok) {
      return NextResponse.json(
        { error: 'Nama, harga, dan stok wajib diisi' },
        { status: 400 }
      );
    }

    const updated = await prisma.produk.update({
      where: { id: Number(id) },
      data: {
        nama,
        harga: Number(harga),
        stok: Number(stok),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    await prisma.produk.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}