'use server';

import { prisma } from '@/app/lib/prisma';

export interface Analytics {
  totalProducts: number;
  totalRevenue: number;
  mostSoldProduct: {
    id: number;
    nama: string;
    harga: number;
    foto?: string;
  } | null;
  totalQuantitySold: number;
}

export interface Transaction {
  id: number;
  orderId: string;
  customer: string;
  total_harga: number;
  status: string;
  tanggal: Date | string;
  produk?: {
    id: number;
    nama: string;
    harga: number;
    foto?: string;
  } | null;
}

export interface ChartData {
  labels: string[];
  incomeData: number[];
  customerData: number[];
}

// Fungsi untuk mengambil data analytics
export async function getAnalyticsData(): Promise<Analytics> {
  try {
    const totalProducts = await prisma.produk.count();

    const transactions = await prisma.transaksi.findMany({
      select: {
        produkId: true,
        jumlah_beli: true,
        total_harga: true,
      },
    });

    const totalRevenue = transactions.reduce((sum, trx) => {
      return sum + Number(trx.total_harga);
    }, 0);

    const salesMap: Record<number, number> = {};
    let totalQuantitySold = 0;

    for (const trx of transactions) {
      const produkId = trx.produkId;
      const quantity = Number(trx.jumlah_beli);
      
      salesMap[produkId] = (salesMap[produkId] || 0) + quantity;
      totalQuantitySold += quantity;
    }

    let mostSoldProductId = 0;
    let mostSoldQuantity = 0;

    for (const [produkIdStr, quantity] of Object.entries(salesMap)) {
      const produkId = parseInt(produkIdStr);
      if (quantity > mostSoldQuantity) {
        mostSoldProductId = produkId;
        mostSoldQuantity = quantity;
      }
    }

    let mostSoldProduct = null;
    if (mostSoldProductId > 0) {
      const product = await prisma.produk.findUnique({
        where: { id: mostSoldProductId },
        select: {
          id: true,
          nama: true,
          harga: true,
          foto: true,
        },
      });

      if (product) {
        mostSoldProduct = {
          id: product.id,
          nama: product.nama,
          harga: Number(product.harga),
          foto: product.foto || '',
        };
      }
    }

    return {
      totalProducts,
      totalRevenue,
      mostSoldProduct,
      totalQuantitySold,
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
        produk: {
          select: {
            id: true,
            nama: true,
            harga: true,
            foto: true,
          },
        },
      },
      orderBy: {
        tanggal: 'desc',
      },
    });
    return transactions.map(trx => ({
      id: trx.id,
      orderId: trx.orderId || `ORD-${trx.id}`,
      customer: trx.customer, 
      total_harga: Number(trx.total_harga),
      status: trx.status,
      tanggal: trx.tanggal,
      produk: trx.produk ? {
        id: trx.produk.id,
        nama: trx.produk.nama,
        harga: Number(trx.produk.harga),
        foto: trx.produk.foto || '',
      } : null,
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
    const uniqueCustomersPerMonth = new Map<number, Set<string>>();

    for (let i = 0; i < 12; i++) {
      uniqueCustomersPerMonth.set(i, new Set<string>());
    }

    transactions.forEach((item: Transaction) => {
      try {
        const date = new Date(item.tanggal);
        
        if (isNaN(date.getTime())) {
          console.warn('Invalid date found:', item.tanggal);
          return;
        }

        const monthIndex = date.getMonth();
        
        incomeByMonth[monthIndex] += Number(item.total_harga || 0);

        const customerSet = uniqueCustomersPerMonth.get(monthIndex);
        if (customerSet && item.customer) {
          customerSet.add(item.customer);
        }
      } catch (error) {
        console.warn('Error processing transaction:', item, error);
      }
    });

    for (let i = 0; i < 12; i++) {
      const customerSet = uniqueCustomersPerMonth.get(i);
      customersByMonth[i] = customerSet ? customerSet.size : 0;
    }

    const activeMonthsIndices = incomeByMonth.map((val, idx) => 
      val > 0 || customersByMonth[idx] > 0 ? idx : -1
    ).filter(idx => idx !== -1);

    if (activeMonthsIndices.length === 0) {
      return {
        labels: [],
        incomeData: [],
        customerData: [],
      };
    }

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