import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { nama, harga, stok, warna, foto } = body;

    if (!nama || harga === undefined || stok === undefined) {
      return NextResponse.json(
        { error: "Field nama, harga, dan stok wajib diisi untuk update." },
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

    const updatedProduk = await prisma.produk.update({
      where: { id: parseInt(id) },
      data: {
        nama,
        harga: parsedHarga,
        stok: parsedStok,
        warna: warna || undefined,
        foto: foto || undefined,
      },
    });

    return NextResponse.json(updatedProduk);
  } catch (error: any) {
    console.error("Gagal update produk (PUT):", error);
    return NextResponse.json(
      {
        error: "Gagal update produk",
        details: error.message,
        prismaCode: error.code || null,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await prisma.produk.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Produk berhasil dihapus" });
  } catch (error: any) {
    console.error("Gagal hapus produk (DELETE):", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json(
      {
        error: "Gagal hapus produk",
        details: error.message,
        prismaCode: error.code || null,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}