import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const produk = await prisma.produk.findMany();
    return NextResponse.json(produk);
  } catch (error) {
    console.error('Gagal mengambil produk:', error);
    return NextResponse.json({ error: 'Gagal mengambil produk' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, harga, stok, warna, foto } = body;
    
    // Validasi field wajib
    if (!nama || !harga || !stok) {
      return NextResponse.json({ error: 'Field nama, harga, dan stok wajib diisi' }, { status: 400 });
    }

    const newProduk = await prisma.produk.create({
      data: { 
        nama, 
        harga, 
        stok, 
        warna: warna || null, // Optional field
        foto: foto || null    // Optional field
      },
    });
    
    return NextResponse.json(newProduk, { status: 201 });
  } catch (error) {
    console.error('Gagal menambahkan produk:', error);
    return NextResponse.json({ error: 'Gagal menambahkan produk' }, { status: 500 });
  }
}