// File: app/dashboardutama/components/BestSellingProduct.tsx
import Image from 'next/image';
import { getAnalyticsData } from '../actions';

export default async function BestSellingProduct() {
  const analytics = await getAnalyticsData();

  return (
    <div className="bg-gradient-to-br from-[#303477] to-[#1d285c] p-6 rounded-3xl shadow-lg text-white">
      <h2 className="text-lg font-semibold mb-4">Most Sold Product</h2>
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
  );
}