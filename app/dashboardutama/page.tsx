// File: app/dashboardutama/page.tsx
import { Suspense } from 'react';
import DashboardSkeleton from './components/DashboardSkeleton';
import AnalyticsSummary from './components/AnalyticsSummary';
import AnalyticsCharts from './components/AnalyticsCharts';
import BestSellingProduct from './components/BestSellingProduct';
import RecentOrders from './components/RecentOrders';
import { getAnalyticsData, getTransactionsData, prepareChartData } from './actions';
import DashboardProductCRUD from './components/DashboardProductCRUD';

export default async function DashboardUtamaPage() {
  return (
    <div className="bg-gradient-to-br from-[#303477] to-[#1d285c] p-6 rounded-3xl shadow-lg text-white">
      {/* Main Content */}
      <div className="relative z-10 p-6 space-y-8">
        {/* Dashboard Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Dashboard Utama
          </h1>
          <p className="text-blue-200 text-lg md:text-xl">
            Selamat datang di dashboard utama!
          </p>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Suspense fallback={
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl animate-pulse">
              <div className="h-24 bg-white/10 rounded-xl"></div>
            </div>
          }>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20 shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-105">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl p-6 border border-white/10">
                <AnalyticsSummary />
              </div>
            </div>
          </Suspense>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Suspense fallback={
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl animate-pulse">
              <div className="h-64 bg-white/10 rounded-xl"></div>
            </div>
          }>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20 shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-[1.02] group">
              <div className="bg-gradient-to-br from-indigo-500/20 to-blue-600/20 rounded-xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                  <h3 className="text-white font-semibold text-lg">Income Analytics</h3>
                </div>
                <AnalyticsCharts type="income" />
              </div>
            </div>
          </Suspense>
          
          <Suspense fallback={
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl animate-pulse">
              <div className="h-64 bg-white/10 rounded-xl"></div>
            </div>
          }>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20 shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-[1.02] group">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
                  <h3 className="text-white font-semibold text-lg">Customer Analytics</h3>
                </div>
                <AnalyticsCharts type="customers" />
              </div>
            </div>
          </Suspense>
        </div>

        {/* Product and Orders Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Suspense fallback={
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl animate-pulse">
              <div className="h-48 bg-white/10 rounded-xl"></div>
            </div>
          }>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20 shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-[1.02] group">
              <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3 animate-pulse"></div>
                  <h3 className="text-white font-semibold text-lg">Best Selling Products</h3>
                </div>
                <BestSellingProduct />
              </div>
            </div>
          </Suspense>
          
          <Suspense fallback={
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl animate-pulse">
              <div className="h-48 bg-white/10 rounded-xl"></div>
            </div>
          }>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20 shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-[1.02] group">
              <div className="bg-gradient-to-br from-teal-500/20 to-cyan-600/20 rounded-xl p-6 border border-white/10">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full mr-3 animate-pulse"></div>
                  <h3 className="text-white font-semibold text-lg">Recent Orders</h3>
                </div>
                <RecentOrders />
              </div>
            </div>
          </Suspense>
        </div>

        {/* CRUD Produk Section */}
        <div className="grid grid-cols-1 gap-6">
          <Suspense fallback={
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl animate-pulse">
              <div className="h-64 bg-white/10 rounded-xl"></div>
            </div>
          }>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20 shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-[1.01] group">
              <div className="bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl p-6 border border-white/10">
                <div className="flex items-center mb-6">
                  <div className="w-4 h-4 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                  <h3 className="text-white font-bold text-xl">Product Management</h3>
                  <div className="ml-auto px-3 py-1 bg-green-500/20 rounded-full border border-green-400/30">
                    <span className="text-green-300 text-sm font-medium">Active</span>
                  </div>
                </div>
                <DashboardProductCRUD />
              </div>
            </div>
          </Suspense>
        </div>

        {/* Footer Stats */}
        <div className="mt-12 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <p className="text-blue-200 text-sm">
              Dashboard updated in real-time • Last refresh: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}