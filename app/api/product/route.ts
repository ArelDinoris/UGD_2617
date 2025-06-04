import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const produk = await prisma.produk.findMany({
      orderBy: { // Optional: You might want to order them as in your previous code
        id: 'desc'
      }
    });
    return NextResponse.json(produk);
  } catch (error) {
    console.error('Gagal mengambil produk:', error);
    // It's good practice to log the full error object for debugging
    return NextResponse.json({ error: 'Gagal mengambil produk'}, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Destructure all expected fields, even if they are optional for the API request
    const { nama, harga, stok, warna, foto } = body;

    // --- Start of refined validation and type conversion ---

    // 1. Validate presence of required fields
    if (!nama || harga === undefined || stok === undefined) {
      // Use `=== undefined` for numbers to allow 0 as a valid input
      return NextResponse.json({ error: 'Field nama, harga, dan stok wajib diisi' }, { status: 400 });
    }

    // 2. Convert harga and stok to numbers (assuming your schema uses Int)
    const parsedHarga = parseInt(harga);
    const parsedStok = parseInt(stok);

    // 3. Validate if conversion was successful (i.e., input was a valid number)
    if (isNaN(parsedHarga) || isNaN(parsedStok)) {
      return NextResponse.json({ error: 'Harga dan stok harus berupa angka yang valid.' }, { status: 400 });
    }
    // If harga is a Float/Decimal in your schema, use parseFloat instead:
    // const parsedHarga = parseFloat(harga);

    // 4. Handle 'warna' and 'foto' based on your Prisma schema:
    let dataToCreate: any = {
      nama,
      harga: parsedHarga,
      stok: parsedStok,
    };

    // If 'warna' and 'foto' are optional in your schema (e.g., String?)
    if (warna !== undefined) {
      dataToCreate.warna = warna;
    }
    if (foto !== undefined) {
      dataToCreate.foto = foto;
    }

    // If 'warna' and 'foto' are REQUIRED in your schema and you expect them always:
    // You'd add them to the initial `if` check and directly assign them to dataToCreate.
    // if (!nama || harga === undefined || stok === undefined || !warna || !foto) { ... }
    // dataToCreate = { nama, harga: parsedHarga, stok: parsedStok, warna, foto };


    // --- End of refined validation and type conversion ---


    const newProduk = await prisma.produk.create({
      data: dataToCreate, // Use the prepared data object
    });

    return NextResponse.json(newProduk, { status: 201 });
  } catch (error: any) { // Type 'error' as 'any' for better logging initially
    console.error('Gagal menambahkan produk:', error);
    // Log more details for debugging
    return NextResponse.json(
      {
        error: 'Gagal menambahkan produk',
        details: error.message,
        // If it's a PrismaClientKnownRequestError, it will have a 'code' property
        // For example, P2002 for unique constraint violation
        prismaCode: error.code || null
      },
      { status: 500 }
    );
  } finally {
    // It's good practice to disconnect Prisma client in route handlers
    // after the request has been processed to prevent connection pooling issues
    await prisma.$disconnect();
  }
}