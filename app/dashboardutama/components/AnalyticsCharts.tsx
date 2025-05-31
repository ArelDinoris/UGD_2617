// File: app/dashboardutama/components/AnalyticsCharts.tsx
import { prepareChartData } from '../actions';
import ClientChartRenderer from '@/app/dashboardutama/components/ClientChartRenderer';

interface AnalyticsChartsProps {
  type: 'income' | 'customers';
}

export default async function AnalyticsCharts({ type }: AnalyticsChartsProps) {
  const chartData = await prepareChartData();
  
  return (
    <div className="bg-gradient-to-br from-[#303477] to-[#1d285c] p-6 rounded-3xl shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-white">
        {type === 'income' ? 'Income Graph / Month' : 'Customers Graph / Month'}
      </h2>
      <div className="h-64">
        {chartData.labels.length > 0 ? (
          <ClientChartRenderer 
            labels={chartData.labels} 
            data={type === 'income' ? chartData.incomeData : chartData.customerData}
            type={type}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-300">
              No {type === 'income' ? 'income' : 'customer'} data available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}