"use client";

import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { motion, Variants } from "framer-motion";

/* ─── Animation Orchestration ─── */
const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

const fadeUpSlow: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9,  ease: "easeOut" },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8,  ease: "easeOut" },
  },
};

/* ─── Mini Dashboard Fragments ─── */
function CompletionCard() {
  return (
    <div className="group relative p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-white/20 hover:bg-white/[0.05]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative">
        <div className="flex items-center justify-between mb-5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Sprint Velocity
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-zinc-500">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF08] shadow-[0_0_6px_#00FF08]" />
            Live
          </span>
        </div>
        <div className="text-[3.5rem] font-black leading-none tracking-tighter text-white">
          98<span className="text-2xl text-zinc-500">.4%</span>
        </div>
        <div className="mt-4 flex gap-1.5">
          {[85, 92, 78, 95, 88, 97, 94, 98].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end h-10">
              <div
                className="w-full rounded-sm bg-gradient-to-t from-zinc-700 to-zinc-500 group-hover:from-zinc-600 group-hover:to-zinc-400 transition-all duration-500"
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KanbanCard() {
  const cols = [
    { label: "Backlog", items: 3, color: "bg-zinc-600" },
    { label: "In Progress", items: 2, color: "bg-[#FB3640]/60" },
    { label: "Done", items: 5, color: "bg-emerald-600/60" },
  ];
  return (
    <div className="group relative p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-white/20 hover:bg-white/[0.05]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-4">
          Board — Q2 Pipeline
        </div>
        <div className="grid grid-cols-3 gap-2">
          {cols.map((col) => (
            <div key={col.label}>
              <div className="text-[9px] font-medium text-zinc-600 mb-2 truncate">
                {col.label}
              </div>
              <div className="space-y-1.5">
                {Array.from({ length: col.items }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 rounded-md bg-white/[0.04] border border-white/[0.06]"
                  >
                    <div
                      className={`h-full rounded-md ${col.color} opacity-40`}
                      style={{ width: `${60 + Math.random() * 40}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityCard() {
  const rows = [
    { user: "AK", action: "moved task to Done", time: "2m ago" },
    { user: "SR", action: "created new sprint", time: "8m ago" },
    { user: "PK", action: "assigned 3 tasks", time: "14m ago" },
  ];
  return (
    <div className="group relative p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-white/20 hover:bg-white/[0.05] col-span-2">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Live Activity Feed
          </span>
          <div className="flex -space-x-1.5">
            {["AK", "SR", "PK"].map((u) => (
              <div
                key={u}
                className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[7px] font-bold text-zinc-400"
              >
                {u}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-zinc-800/80 flex items-center justify-center text-[8px] font-bold text-zinc-400 shrink-0">
                {row.user}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-zinc-300">{row.action}</span>
              </div>
              <span className="text-[10px] text-zinc-600 shrink-0">
                {row.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UptimeCard() {
  return (
    <div className="group relative p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-white/20 hover:bg-white/[0.05]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative text-center">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-3">
          System Uptime
        </div>
        <div className="text-2xl font-black text-white tracking-tight">
          99.99%
        </div>
        <div className="flex justify-center gap-[3px] mt-3">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-3 rounded-full bg-emerald-500/30"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Feature Grid Items ─── */
const features = [
  {
    tag: "Security",
    title: "Role-Based Isolation",
    desc: "Enterprise-grade access control. Admins hold strategic oversight while contributors see only their deliverables.",
  },
  {
    tag: "Performance",
    title: "Optimistic Updates",
    desc: "Powered by Server Actions. Board changes register instantly without waiting for network round-trips.",
  },
  {
    tag: "Visibility",
    title: "Pipeline Intelligence",
    desc: "Immediate visual feedback on project bottlenecks, overdue tasks, and contributor velocity metrics.",
  },
];

/* ─── Page Component ─── */
export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-[#FB3640]/30 selection:text-white overflow-hidden">
      {/* ─── Ambient Background ─── */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#FB3640]/[0.04] blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-zinc-500/[0.03] blur-[100px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* ─── Navigation ─── */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 w-full z-50 border-b border-white/[0.06] bg-zinc-950/70 backdrop-blur-2xl"
      >
        <div className="max-w-[1320px] mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FB3640] to-red-800 flex items-center justify-center shadow-[0_0_16px_rgba(251,54,64,0.25)] group-hover:shadow-[0_0_24px_rgba(251,54,64,0.35)] transition-shadow">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tight text-[17px]">
              TaskFlow
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className="text-sm text-zinc-400 hover:text-white transition-colors duration-300"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="text-sm px-4 py-2 bg-white/[0.06] border border-white/10 rounded-lg text-zinc-200 hover:bg-white/[0.1] hover:text-white transition-all duration-300 flex items-center gap-1.5"
            >
              Dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero Section — Asymmetrical Editorial ─── */}
      <main className="relative z-10">
        <section className="max-w-[1320px] mx-auto px-6 lg:px-8 pt-36 lg:pt-44 pb-20 lg:pb-32">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-6 items-start">
            {/* Left Column — 7 cols on large screens */}
            <motion.div
              className="lg:col-span-7 space-y-8"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {/* Status Pill */}
              <motion.div variants={fadeUp}>
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-medium text-zinc-400 tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF08] shadow-[0_0_6px_#00FF08]" />
                  System Live — v2.0 Production
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                className="text-[clamp(3rem,7vw,6.5rem)] font-black leading-[0.92] tracking-[-0.04em]"
              >
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-zinc-500">
                  Execute with
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-zinc-200 to-zinc-600">
                  absolute precision.
                </span>
              </motion.h1>

              {/* Sub-copy */}
              <motion.p
                variants={fadeUp}
                className="text-base lg:text-lg text-zinc-500 max-w-lg leading-relaxed"
              >
                TaskFlow strips away the noise. Built for engineering and
                analytics teams who need to track, assign, and ship complex
                pipelines — without the clutter.
              </motion.p>

              {/* CTA Row */}
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <Link
                  href="/login"
                  className="group relative inline-flex items-center gap-2 px-7 py-3.5 bg-[#FB3640] text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:brightness-110 shadow-[0_0_24px_rgba(251,54,64,0.3),_0_2px_8px_rgba(0,0,0,0.4)] hover:shadow-[0_0_40px_rgba(251,54,64,0.45),_0_4px_16px_rgba(0,0,0,0.5)]"
                >
                  Start Executing
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="https://github.com/pradipta2005/Task_Flow"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent border border-white/10 text-zinc-400 text-sm font-medium rounded-xl transition-all duration-300 hover:border-white/20 hover:text-white hover:bg-white/[0.03]"
                >
                  View Architecture
                </Link>
              </motion.div>

              {/* Social Proof Strip */}
              <motion.div
                variants={fadeUp}
                className="flex items-center gap-6 pt-6 border-t border-white/[0.06]"
              >
                <div>
                  <div className="text-2xl font-black text-white tracking-tight">
                    4.2k+
                  </div>
                  <div className="text-[10px] text-zinc-600 uppercase tracking-widest mt-0.5">
                    Tasks Managed
                  </div>
                </div>
                <div className="w-px h-10 bg-white/[0.06]" />
                <div>
                  <div className="text-2xl font-black text-white tracking-tight">
                    12
                  </div>
                  <div className="text-[10px] text-zinc-600 uppercase tracking-widest mt-0.5">
                    Active Teams
                  </div>
                </div>
                <div className="w-px h-10 bg-white/[0.06]" />
                <div>
                  <div className="text-2xl font-black text-white tracking-tight">
                    99.9%
                  </div>
                  <div className="text-[10px] text-zinc-600 uppercase tracking-widest mt-0.5">
                    Uptime SLA
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column — 5 cols, Bento Box Dashboard Fragments */}
            <motion.div
              className="lg:col-span-5 relative hidden lg:block"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {/* Glow behind bento */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#FB3640]/[0.06] blur-[100px] rounded-full pointer-events-none" />

              <div className="relative grid grid-cols-2 gap-3">
                <motion.div variants={fadeUpSlow}>
                  <CompletionCard />
                </motion.div>
                <motion.div variants={fadeUpSlow} className="mt-10">
                  <KanbanCard />
                </motion.div>
                <motion.div variants={scaleIn}>
                  <ActivityCard />
                </motion.div>
                <motion.div variants={fadeUpSlow}>
                  <UptimeCard />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Feature Grid — Editorial Style ─── */}
        <section className="border-t border-white/[0.06]">
          <motion.div
            className="max-w-[1320px] mx-auto px-6 lg:px-8 py-24 lg:py-32"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeUp} className="mb-16">
              <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-600 mb-3">
                Core Capabilities
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                Built for teams who ship.
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="group relative p-7 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl transition-all duration-500 hover:border-white/[0.16] hover:bg-white/[0.04]"
                >
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-4">
                    {f.tag}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                    {f.title}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ─── Bottom CTA Band ─── */}
        <section className="border-t border-white/[0.06]">
          <motion.div
            className="max-w-[1320px] mx-auto px-6 lg:px-8 py-24 lg:py-28 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-600 mb-4"
            >
              Ready to ship
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500"
            >
              Stop planning. Start executing.
            </motion.h2>
            <motion.div variants={fadeUp} className="mt-8">
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-[#FB3640] text-white font-semibold rounded-xl transition-all duration-300 hover:brightness-110 shadow-[0_0_24px_rgba(251,54,64,0.3),_0_2px_8px_rgba(0,0,0,0.4)] hover:shadow-[0_0_40px_rgba(251,54,64,0.45),_0_4px_16px_rgba(0,0,0,0.5)]"
              >
                Get Started Now
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="border-t border-white/[0.06] py-8">
          <div className="max-w-[1320px] mx-auto px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-[#FB3640] to-red-900 flex items-center justify-center">
                <Layers className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-zinc-600 tracking-tight">
                TaskFlow
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-700">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF08] shadow-[0_0_4px_#00FF08]" />
              All Systems Operational
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
