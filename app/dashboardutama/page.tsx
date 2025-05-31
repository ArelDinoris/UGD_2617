// File: app/dashboardutama/page.tsx
import { Suspense } from 'react';
import DashboardSkeleton from './components/DashboardSkeleton';
import AnalyticsSummary from './components/AnalyticsSummary';
import AnalyticsCharts from './components/AnalyticsCharts';
import BestSellingProduct from './components/BestSellingProduct';
import RecentOrders from './components/RecentOrders';
import { getAnalyticsData, getTransactionsData, prepareChartData } from './actions';

export default async function DashboardUtamaPage() {
  return (
    <div className="space-y-8">
      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Suspense fallback={<DashboardSkeleton type="summary" count={3} />}>
          <AnalyticsSummary />
        </Suspense>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense fallback={<DashboardSkeleton type="chart" count={1} />}>
          <AnalyticsCharts type="income" />
        </Suspense>
        <Suspense fallback={<DashboardSkeleton type="chart" count={1} />}>
          <AnalyticsCharts type="customers" />
        </Suspense>
      </div>

      {/* Product and Orders Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense fallback={<DashboardSkeleton type="product" count={1} />}>
          <BestSellingProduct />
        </Suspense>
        <Suspense fallback={<DashboardSkeleton type="orders" count={1} />}>
          <RecentOrders />
        </Suspense>
      </div>
    </div>
  );
}