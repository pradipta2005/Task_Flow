"use client";
export default function DashboardLoading() {
  return (
    <div className="space-y-6 max-w-[1200px] animate-pulse">
      <div className="h-6 w-40 bg-white/[0.03] rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-28 bg-white/[0.02] rounded-2xl" />)}
      </div>
      <div className="h-64 bg-white/[0.02] rounded-2xl" />
    </div>
  );
}
