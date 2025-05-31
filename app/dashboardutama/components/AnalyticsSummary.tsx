// File: app/dashboardutama/components/AnalyticsSummary.tsx
import { getAnalyticsData, getTransactionsData } from '../actions';

export default async function AnalyticsSummary() {
  const analytics = await getAnalyticsData();
  const transactions = await getTransactionsData();

  const summaryItems = [
    { title: 'Total Products', value: analytics.totalProducts },
    { title: 'Total Transactions', value: transactions.length },
    { title: 'Total Income', value: `Rp ${analytics.totalRevenue.toLocaleString()}` },
  ];

  return (
    <>
      {summaryItems.map((item, idx) => (
        <div
          key={idx}
          className="bg-gradient-to-br from-[#303477] to-[#1d285c] p-6 rounded-3xl text-center shadow-lg flex flex-col items-center transition hover:scale-[1.01] cursor-pointer"
        >
          <h2 className="text-lg font-semibold text-white">{item.title}</h2>
          <p className="text-3xl font-bold mt-2 text-white">{item.value}</p>
        </div>
      ))}
    </>
  );
}