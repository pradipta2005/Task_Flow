"use client";
export default function ProfileLoading() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
      <div className="h-40 bg-white/[0.02] rounded-2xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-24 bg-white/[0.02] rounded-2xl" />)}</div>
    </div>
  );
}
