import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const produk = await prisma.produk.findMany();
    return NextResponse.json(produk);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil produk' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, harga, stok, warna, foto } = body;

    const newProduk = await prisma.produk.create({
      data: { nama, harga, stok, warna, foto },
    });

    return NextResponse.json(newProduk, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menambahkan produk' }, { status: 500 });
  }
}
