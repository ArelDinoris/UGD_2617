import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const produk = await prisma.produk.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(produk);
  } catch (error) {
    console.error("Gagal mengambil produk:", error);
    return NextResponse.json(
      { error: "Gagal mengambil produk" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, harga, stok, warna, foto } = body;

    if (!nama || harga === undefined || stok === undefined) {
      return NextResponse.json(
        { error: "Field nama, harga, dan stok wajib diisi" },
        { status: 400 }
      );
    }

    const parsedHarga = parseInt(harga);
    const parsedStok = parseInt(stok);

    if (isNaN(parsedHarga) || isNaN(parsedStok)) {
      return NextResponse.json(
        { error: "Harga dan stok harus berupa angka yang valid." },
        { status: 400 }
      );
    }

    const dataToCreate = {
      nama,
      harga: parsedHarga,
      stok: parsedStok,
      warna: warna || undefined,
      foto: foto || undefined,
    };

    const newProduk = await prisma.produk.create({
      data: dataToCreate,
    });

    return NextResponse.json(newProduk, { status: 201 });
  } catch (error: any) {
    console.error("Gagal menambahkan produk:", error);
    return NextResponse.json(
      {
        error: "Gagal menambahkan produk",
        details: error.message,
        prismaCode: error.code || null,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}