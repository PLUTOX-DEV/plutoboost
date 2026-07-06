import React from 'react';

const SkeletonBox = ({ className }) => (
  <div className={`bg-gray-700/50 rounded-lg animate-pulse ${className}`} />
);

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-black/40 text-gray-400">
          <tr>
            {[...Array(cols)].map((_, i) => (
              <th key={i} className="px-6 py-4 text-left font-medium">
                <SkeletonBox className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, i) => (
            <tr key={i} className="border-t border-white/5">
              {[...Array(cols)].map((_, j) => (
                <td key={j} className="px-6 py-4">
                  <SkeletonBox className="h-5 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-pulse">
      {/* HEADER */}
      <div>
        <SkeletonBox className="h-8 w-1/3 mb-2" />
        <SkeletonBox className="h-4 w-1/4" />
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <SkeletonBox className="h-24 rounded-xl" />
        <SkeletonBox className="h-24 rounded-xl" />
      </div>

      {/* ORDER FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6 h-96 bg-gray-800/30"></div>
        <div className="glass rounded-2xl p-6 h-96 bg-gray-800/30"></div>
      </div>

      {/* RECENT ORDERS */}
      <div className="glass rounded-2xl p-6 h-64 bg-gray-800/30"></div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* HEADER */}
      <div>
        <SkeletonBox className="h-8 w-1/3 mb-2" />
        <SkeletonBox className="h-4 w-1/4" />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <SkeletonBox className="h-24 rounded-2xl" />
        <SkeletonBox className="h-24 rounded-2xl" />
        <SkeletonBox className="h-24 rounded-2xl" />
        <SkeletonBox className="h-24 rounded-2xl" />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6 h-80 bg-gray-800/30"></div>
        <div className="glass rounded-2xl p-6 h-80 bg-gray-800/30"></div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6 h-96 bg-gray-800/30"></div>
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 h-44 bg-gray-800/30"></div>
          <div className="glass rounded-2xl p-6 h-44 bg-gray-800/30"></div>
        </div>
      </div>
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="relative z-10 space-y-6 sm:space-y-8 animate-pulse">
      {/* HEADER */}
      <div>
        <SkeletonBox className="h-8 w-1/3 mb-2" />
        <SkeletonBox className="h-4 w-1/4" />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SkeletonBox className="h-24 rounded-xl" />
        <SkeletonBox className="h-24 rounded-xl" />
        <SkeletonBox className="h-24 rounded-xl" />
        <SkeletonBox className="h-24 rounded-xl" />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 glass rounded-2xl h-80 bg-gray-800/30"></div>
        <div className="glass rounded-2xl h-80 bg-gray-800/30"></div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="glass rounded-2xl h-72 bg-gray-800/30"></div>
        <div className="glass rounded-2xl h-72 bg-gray-800/30"></div>
      </div>
    </div>
  );
}