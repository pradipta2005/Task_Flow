"use client";
export default function ProjectsError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 rounded-2xl bg-[#FB3640]/10 flex items-center justify-center"><span className="text-[#FB3640] text-xl">!</span></div>
      <h2 className="text-lg font-semibold text-foreground">Failed to load projects</h2>
      <p className="text-sm text-zinc-500">{error.message}</p>
      <button onClick={reset} className="px-5 py-2 rounded-lg bg-white/[0.06] text-sm font-medium text-foreground border border-white/[0.06] hover:bg-white/[0.09] transition-colors">Retry</button>
    </div>
  );
}
