import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { nama, harga, stok } = body;

    const updated = await prisma.produk.update({
      where: { id: Number(id) },
      data: { nama, harga, stok },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Gagal update produk:', error);
    return NextResponse.json({ error: 'Gagal update produk' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await prisma.produk.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error('Gagal hapus produk:', error);
    return NextResponse.json({ error: 'Gagal hapus produk' }, { status: 500 });
  }
}
