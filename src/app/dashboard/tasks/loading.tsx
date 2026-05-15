"use client";
export default function TasksLoading() {
  return (
    <div className="h-full flex flex-col space-y-5 max-w-[1200px] animate-pulse">
      <div className="h-6 w-36 bg-white/[0.03] rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 min-h-0">
        {[1,2,3].map(i => <div key={i} className="bg-white/[0.02] rounded-2xl" />)}
      </div>
    </div>
  );
}
