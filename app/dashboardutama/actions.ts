// File: app/dashboardutama/actions.ts
'use server';

import { prisma } from '@/app/lib/prisma';

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

export interface Transaction {
  id: number;
  orderId: string;
  customer: string;
  total_harga: number;
  status: string;
  tanggal: string;
}

export interface ChartData {
  labels: string[];
  incomeData: number[];
  customerData: number[];
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
    });

    // Hitung total pendapatan
    const totalRevenue = transactions.reduce((sum, trx) => {
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
        })
      : null;

    return {
      totalProducts,
      totalRevenue,
      mostSoldProduct: mostSoldProduct as any || null,
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
    return transactions as unknown as Transaction[];
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