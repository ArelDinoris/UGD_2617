'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Analytics {
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

interface Transaction {
  id: number;
  orderId: string;
  customer: string;
  total_harga: number;
  status: string;
  tanggal: string;
}

const DashboardUtamaPage = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [incomeData, setIncomeData] = useState<number[]>([]);
  const [customerData, setCustomerData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analyticsRes = await fetch('/api/analytics');
        const analyticsData = await analyticsRes.json();

        const transactionsRes = await fetch('/api/dash');
        let transactionsData = await transactionsRes.json();
        transactionsData = transactionsData.slice(0, 5);

        setAnalytics(analyticsData);
        setTransactions(transactionsData);

        const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December',
        ];
        const incomeByMonth = new Array(12).fill(0);
        const customersByMonth = new Array(12).fill(0);
        const uniqueCustomers = new Set<string>();

        transactionsData.forEach((item: Transaction) => {
          const date = new Date(item.tanggal);
          const monthIndex = date.getMonth();
          incomeByMonth[monthIndex] += item.total_harga;

          if (!uniqueCustomers.has(`${item.customer}-${monthIndex}`)) {
            customersByMonth[monthIndex] += 1;
            uniqueCustomers.add(`${item.customer}-${monthIndex}`);
          }
        });

        const filteredMonths = months.filter((_, index) => incomeByMonth[index] > 0 || customersByMonth[index] > 0);
        const filteredIncome = incomeByMonth.filter((val) => val > 0);
        const filteredCustomers = customersByMonth.filter((val) => val > 0);

        setLabels(filteredMonths);
        setIncomeData(filteredIncome);
        setCustomerData(filteredCustomers);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const incomeChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Income (Rp)',
        data: incomeData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const customerChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Unique Customers',
        data: customerData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#fff',
        },
      },
      title: {
        display: true,
        color: '#fff',
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  if (loading) {
    return <div className="text-center py-10 text-white">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-8">
      {/* RINGKASAN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Total Products', value: analytics?.totalProducts || 0 },
          { title: 'Total Transactions', value: transactions.length || 0 },
          { title: 'Total Income', value: `Rp ${analytics?.totalRevenue?.toLocaleString() || 0}` },
        ].map((item, idx) => (
          <div key={idx} className="bg-gradient-to-br from-[#303477] to-[#1d285c] p-6 rounded-3xl text-center shadow-lg flex flex-col items-center transition hover:scale-[1.01] cursor-pointer">
            <h2 className="text-lg font-semibold text-white">{item.title}</h2>
            <p className="text-3xl font-bold mt-2 text-white">{item.value}</p>
          </div>
        ))}
      </div>

      {/* GRAFIK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#303477] to-[#1d285c] p-6 rounded-3xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-white">Income Graph / Month</h2>
          <div className="h-64">
            {labels.length > 0 ? (
              <Line
                data={incomeChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: 'Monthly Income',
                      color: '#fff',
                    },
                  },
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-300">No income data available</p>
              </div>
            )}
          </div>
        </div>
        <div className="bg-gradient-to-br from-[#303477] to-[#1d285c] p-6 rounded-3xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-white">Customers Graph / Month</h2>
          <div className="h-64">
            {labels.length > 0 ? (
              <Line
                data={customerChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: 'Monthly Unique Customers',
                      color: '#fff',
                    },
                  },
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-300">No customer data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PRODUK TERLARIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#303477] to-[#1d285c] p-6 rounded-3xl shadow-lg text-white">
          <h2 className="text-lg font-semibold mb-4">Most Products Sold</h2>
          {analytics?.mostSoldProduct ? (
            <div className="flex items-center space-x-4">
              <div className="relative w-24 h-24">
                <Image
                  src={analytics.mostSoldProduct.foto}
                  alt={analytics.mostSoldProduct.nama}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded"
                />
              </div>
              <div>
                <p className="font-semibold">{analytics.mostSoldProduct.nama}</p>
                <p>Rp {analytics.mostSoldProduct.harga.toLocaleString()}</p>
                <p className="text-sm text-gray-300">Sold: {analytics.totalQuantitySold} units</p>
              </div>
            </div>
          ) : (
            <p>No data available</p>
          )}
        </div>

        <div className="bg-gradient-to-br from-[#303477] to-[#1d285c] p-6 rounded-3xl shadow-lg text-white">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="flex justify-between pb-2 border-b border-gray-600">
                  <div>
                    <p className="font-medium">{transaction.customer}</p>
                    <p className="text-sm text-gray-300">{new Date(transaction.tanggal).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Rp {transaction.total_harga.toLocaleString()}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        transaction.status === 'completed'
                          ? 'bg-green-200 text-green-900'
                          : 'bg-yellow-200 text-yellow-900'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No recent orders</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardUtamaPage;