// File: app/dashboardutama/components/DashboardSkeleton.tsx
'use client';

interface DashboardSkeletonProps {
  type: 'summary' | 'chart' | 'product' | 'orders';
  count: number;
}

const SkeletonBox = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-700 rounded-md ${className}`} aria-hidden="true" />
);

export default function DashboardSkeleton({ type, count }: DashboardSkeletonProps) {
  if (type === 'summary') {
    return (
      <>
        {[...Array(count)].map((_, idx) => (
          <div key={idx} className="bg-gradient-to-br from-[#303477] to-[#1d285c] p-6 rounded-3xl text-center shadow-lg">
            <SkeletonBox className="h-6 w-32 mx-auto mb-4" />
            <SkeletonBox className="h-10 w-24 mx-auto" />
          </div>
        ))}
      </>
    );
  }

  if (type === 'chart') {
    return (
      <div className="bg-gradient-to-br from-[#303477] to-[#1d285c] p-6 rounded-3xl shadow-lg">
        <SkeletonBox className="h-8 w-48 mb-6" />
        <SkeletonBox className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (type === 'product') {
    return (
      <div className="bg-gradient-to-br from-[#303477] to-[#1d285c] p-6 rounded-3xl shadow-lg">
        <SkeletonBox className="h-8 w-48 mb-6" />
        <div className="flex items-center space-x-4">
          <SkeletonBox className="h-24 w-24 rounded" />
          <div className="flex-1">
            <SkeletonBox className="h-6 w-32 mb-2" />
            <SkeletonBox className="h-4 w-24 mb-2" />
            <SkeletonBox className="h-4 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'orders') {
    return (
      <div className="bg-gradient-to-br from-[#303477] to-[#1d285c] p-6 rounded-3xl shadow-lg">
        <SkeletonBox className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex justify-between pb-2 border-b border-gray-600">
              <div className="flex-1">
                <SkeletonBox className="h-5 w-32 mb-2" />
                <SkeletonBox className="h-4 w-24" />
              </div>
              <div className="text-right">
                <SkeletonBox className="h-5 w-24 mb-2" />
                <SkeletonBox className="h-6 w-20 rounded-full ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}