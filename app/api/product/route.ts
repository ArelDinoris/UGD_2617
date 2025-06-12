import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// Fungsi untuk memvalidasi string base64 sebagai gambar
const isValidImageBase64 = (base64String: string): boolean => {
  if (!base64String) return true; // Izinkan null
  const imageRegex = /^data:image\/(jpeg|png|gif|bmp|webp);base64,/;
  return imageRegex.test(base64String);
};

export async function GET() {
  try {
    const products = await prisma.produk.findMany();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Gagal mengambil produk' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nama, harga, stok, warna, foto } = await request.json();

    if (!nama || !harga || !stok || !warna) {
      return NextResponse.json(
        { error: 'Nama, harga, stok, dan warna wajib diisi' },
        { status: 400 }
      );
    }

    if (foto && !isValidImageBase64(foto)) {
      return NextResponse.json(
        { error: 'File harus berupa gambar yang valid (jpg, png, dll)' },
        { status: 400 }
      );
    }

    const product = await prisma.produk.create({
      data: {
        nama,
        harga: Number(harga),
        stok: Number(stok),
        warna,
        foto: foto || null,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Gagal menambah produk' }, { status: 500 });
  }
}