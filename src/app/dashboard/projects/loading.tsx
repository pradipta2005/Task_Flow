"use client";
export default function ProjectsLoading() {
  return (
    <div className="space-y-8 max-w-[1200px] animate-pulse">
      <div className="h-6 w-32 bg-white/[0.03] rounded-lg" />
      <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-28 bg-white/[0.02] rounded-2xl" />)}</div>
    </div>
  );
}
