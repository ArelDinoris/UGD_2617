'use server';

import { prisma } from '@/app/lib/prisma';

// Sesuaikan antarmuka Transaction dengan tipe Prisma
export interface Analytics {
  totalProducts: number;
  totalRevenue: number;
  mostSoldProduct: {
    id: number;
    nama: string;
    harga: number;
    foto: string;
  } | null;
  totalQuantitySold: number;
}

// Definisikan tipe lengkap untuk Transaction berdasarkan hasil Prisma
export interface Transaction {
  id: number;
  orderId: string | null;
  customer: string;
  total_harga: number;
  status: string;
  tanggal: Date;
}

// Tambahkan antarmuka untuk ChartData
export interface ChartData {
  labels: string[];
  incomeData: number[];
  customerData: number[];
}

// Definisikan tipe untuk hasil select transaksi
interface TransactionSelect {
  produkId: number;
  jumlah_beli: number;
  total_harga: number;
}

// Fungsi untuk mengambil data analytics
export async function getAnalyticsData(): Promise<Analytics> {
  try {
    // Hitung total produk
    const totalProducts = await prisma.produk.count();

    // Ambil data transaksi
    const transactions = await prisma.transaksi.findMany({
      select: {
        produkId: true,
        jumlah_beli: true,
        total_harga: true,
      },
    }) as TransactionSelect[];

    // Hitung total pendapatan dengan tipe eksplisit
    const totalRevenue = transactions.reduce((sum: number, trx: TransactionSelect) => {
      return sum + trx.total_harga;
    }, 0);

    // Hitung total jumlah_beli per produkId
    const salesMap: Record<number, number> = {};
    for (const trx of transactions) {
      salesMap[trx.produkId] = (salesMap[trx.produkId] || 0) + trx.jumlah_beli;
    }

    // Cari produkId dengan jumlah jual terbanyak
    let mostSoldProductId = 0;
    let mostSoldQuantity = 0;

    for (const [produkIdStr, quantity] of Object.entries(salesMap)) {
      const produkId = parseInt(produkIdStr);
      if (quantity > mostSoldQuantity) {
        mostSoldProductId = produkId;
        mostSoldQuantity = quantity;
      }
    }

    // Ambil detail produk terlaris
    const mostSoldProduct = mostSoldProductId
      ? await prisma.produk.findUnique({
          where: { id: mostSoldProductId },
          select: { id: true, nama: true, harga: true, foto: true },
        })
      : null;

    return {
      totalProducts,
      totalRevenue,
      mostSoldProduct: mostSoldProduct as any as { id: number; nama: string; harga: number; foto: string } | null,
      totalQuantitySold: mostSoldQuantity,
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw new Error('Failed to fetch analytics data');
  }
}

// Fungsi untuk mengambil data transaksi
export async function getTransactionsData(): Promise<Transaction[]> {
  try {
    const transactions = await prisma.transaksi.findMany({
      include: {
        produk: true,
      },
    });

    // Mapping hasil Prisma ke antarmuka Transaction dengan tipe eksplisit
    return transactions.map((trx: { id: number; orderId: string | null; customer: string; total_harga: number; status: string; tanggal: Date }) => ({
      id: trx.id,
      orderId: trx.orderId,
      customer: trx.customer,
      total_harga: trx.total_harga,
      status: trx.status,
      tanggal: trx.tanggal,
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions data');
  }
}

// Fungsi untuk menyiapkan data chart
export async function prepareChartData(): Promise<ChartData> {
  try {
    const transactions = await getTransactionsData();
    
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    
    const incomeByMonth = new Array(12).fill(0);
    const customersByMonth = new Array(12).fill(0);
    const uniqueCustomers = new Set<string>();

    transactions.forEach((item: Transaction) => {
      const date = new Date(item.tanggal);
      const monthIndex = date.getMonth();
      incomeByMonth[monthIndex] += item.total_harga;

      const customerKey = `${item.customer}-${monthIndex}`;
      if (!uniqueCustomers.has(customerKey)) {
        customersByMonth[monthIndex] += 1;
        uniqueCustomers.add(customerKey);
      }
    });

    const activeMonthsIndices = incomeByMonth.map((val, idx) => 
      val > 0 || customersByMonth[idx] > 0 ? idx : -1
    ).filter(idx => idx !== -1);

    const filteredMonths = activeMonthsIndices.map(idx => months[idx]);
    const filteredIncome = activeMonthsIndices.map(idx => incomeByMonth[idx]);
    const filteredCustomers = activeMonthsIndices.map(idx => customersByMonth[idx]);

    return {
      labels: filteredMonths,
      incomeData: filteredIncome,
      customerData: filteredCustomers,
    };
  } catch (error) {
    console.error('Error preparing chart data:', error);
    throw new Error('Failed to prepare chart data');
  }
}