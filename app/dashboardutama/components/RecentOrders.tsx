// File: app/dashboardutama/components/RecentOrders.tsx
import { getTransactionsData } from '../actions';

export default async function RecentOrders() {
  const transactions = await getTransactionsData();
  const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-[#303477] to-[#1d285c] p-6 rounded-3xl shadow-lg text-white">
      <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
      {recentTransactions.length > 0 ? (
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex justify-between pb-2 border-b border-gray-600"
            >
              <div>
                <p className="font-medium">{transaction.customer}</p>
                <p className="text-sm text-gray-300">
                  {new Date(transaction.tanggal).toLocaleDateString()}
                </p>
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
  );
}