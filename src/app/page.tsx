"use client";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Zap, ArrowRight, Shield, Gauge, BarChart3, Users, CheckCircle2, Lock, Globe2, ArrowUpRight, Play } from "lucide-react";

function DotGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
        <defs>
          <pattern id="dotgrid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotgrid)" />
      </svg>
    </div>
  );
}

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ x: [0, 80, -40, 0], y: [0, -60, 30, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[8%] left-[12%] w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(251,54,64,0.06) 0%, transparent 70%)" }}
      />
      <motion.div
        animate={{ x: [0, -60, 40, 0], y: [0, 50, -80, 0], scale: [1, 0.8, 1.1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-[25%] right-[8%] w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)" }}
      />
      <motion.div
        animate={{ x: [0, 50, -30, 0], y: [0, -40, 60, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)" }}
      />
    </div>
  );
}

function Counter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const num = parseInt(target.replace(/[^0-9]/g, ""));
  const prefix = target.replace(/[0-9.]/g, "").split("")[0] === "<" ? "<" : "";

  useEffect(() => {
    let frame: number;
    const duration = 1500;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(num * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [num]);

  return <span>{prefix}{count}{suffix}</span>;
}

function Marquee() {
  const items = ["Enterprise Security", "Real-Time Sync", "Role-Based Access", "Kanban Boards", "Team Analytics", "Task Assignment", "Optimistic UI", "Data Isolation"];
  return (
    <div className="relative overflow-hidden py-6 border-y border-white/[0.03]">
      <motion.div
        animate={{ x: [0, -1920] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="flex gap-12 whitespace-nowrap"
      >
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="text-[13px] text-zinc-600 font-medium flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

const fadeUp = { initial: { opacity: 0, y: 32 }, animate: { opacity: 1, y: 0 } };
const stagger = { animate: { transition: { staggerChildren: 0.1 } } };

export default function HomePage() {
  const router = useRouter();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  const features = [
    { icon: Shield, title: "Enterprise RBAC", desc: "Admin and Member roles enforce strict data isolation at every API boundary. Zero data leaks between roles.", gradient: "from-blue-600 to-indigo-600" },
    { icon: Gauge, title: "Optimistic Updates", desc: "Server Actions with useOptimistic deliver instant UI feedback. Changes reflect before the database confirms.", gradient: "from-emerald-600 to-teal-600" },
    { icon: BarChart3, title: "Live Analytics", desc: "Executive KPI dashboards with completion rates, workload heatmaps, and overdue task tracking in real-time.", gradient: "from-violet-600 to-purple-600" },
    { icon: Users, title: "Team Command", desc: "Assign members to projects, monitor individual workloads, and manage your entire organization from one hub.", gradient: "from-amber-600 to-orange-600" },
    { icon: Lock, title: "Data Isolation", desc: "Members only access their assigned work. Every endpoint validates permissions before returning a single byte.", gradient: "from-rose-600 to-pink-600" },
    { icon: Globe2, title: "Kanban Workflow", desc: "Visual boards with click-to-advance cards. Todo → In Progress → Done — your team moves forward, never back.", gradient: "from-cyan-600 to-blue-600" },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-foreground overflow-x-hidden">
      <DotGrid />
      <FloatingOrbs />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/60 backdrop-blur-2xl border-b border-white/[0.03]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FB3640] to-[#d62830] flex items-center justify-center shadow-[0_0_20px_rgba(251,54,64,0.15)]">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-[15px] tracking-tight">TaskFlow</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2">
            <button onClick={() => router.push("/login")}
              className="px-4 py-2 text-[13px] text-zinc-400 hover:text-foreground transition-colors font-medium">
              Sign In
            </button>
            <button onClick={() => router.push("/signup")}
              className="px-4 py-2 rounded-lg bg-white text-zinc-900 text-[13px] font-semibold hover:bg-zinc-200 transition-all hover:shadow-[0_0_24px_rgba(255,255,255,0.1)]">
              Get Started
            </button>
          </motion.div>
        </div>
      </nav>

      <section ref={heroRef} className="relative pt-36 pb-20 px-6">
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-10 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[12px] font-medium text-zinc-400">Now shipping v2.0 — Server Actions & Optimistic UI</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-[80px] font-bold tracking-[-0.03em] leading-[0.95] mb-8"
          >
            <span className="block">Ship work,</span>
            <span className="block mt-2 bg-gradient-to-r from-white via-zinc-300 to-zinc-600 bg-clip-text text-transparent">
              not status updates.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl text-zinc-500 max-w-xl mx-auto leading-relaxed mb-12"
          >
            The command center for teams that execute. Real-time kanban boards,
            role-based analytics, and instant task assignment — in one obsidian interface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(255,255,255,0.08)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/signup")}
              className="group px-8 py-4 rounded-xl bg-white text-zinc-900 font-semibold text-[15px] flex items-center gap-3 transition-all"
            >
              Start Building
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/login")}
              className="group px-8 py-4 rounded-xl bg-white/[0.03] text-foreground border border-white/[0.06] font-medium text-[15px] flex items-center gap-3 hover:bg-white/[0.06] transition-all"
            >
              <Play className="w-3.5 h-3.5" />
              Live Demo
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-16 flex items-center justify-center gap-8 text-zinc-600"
          >
            <div className="flex -space-x-2">
              {["A", "S", "M", "K"].map((l, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 border-2 border-[#09090b] flex items-center justify-center text-[10px] font-semibold text-zinc-400">
                  {l}
                </div>
              ))}
            </div>
            <p className="text-[13px]">
              <span className="text-foreground font-semibold">200+</span> teams shipping with TaskFlow
            </p>
          </motion.div>
        </motion.div>
      </section>

      <Marquee />

      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "99.9", suffix: "%", label: "Uptime Guarantee" },
              { value: "50", suffix: "ms", label: "Avg Response", prefix: "<" },
              { value: "256", suffix: "-bit", label: "AES Encryption" },
              { value: "10", suffix: "k+", label: "Tasks Managed" },
            ].map((m, i) => (
              <motion.div key={m.label} variants={fadeUp}
                className="glass-card p-6 rounded-2xl text-center group hover:border-white/[0.1] transition-all">
                <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tabular-nums">
                  {m.prefix || ""}<Counter target={m.value} suffix={m.suffix} />
                </h3>
                <p className="text-[11px] text-zinc-600 uppercase tracking-wider font-medium">{m.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }} className="text-center mb-20">
            <p className="text-[12px] font-semibold text-[#FB3640] uppercase tracking-widest mb-4">Capabilities</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
              Everything you need.
              <br />
              <span className="text-zinc-600">Nothing you don&apos;t.</span>
            </h2>
          </motion.div>

          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} variants={fadeUp}
                  className="group relative p-6 rounded-2xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-500 overflow-hidden">
                  <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-[0.07] blur-3xl transition-opacity duration-700`} />
                  <div className="relative z-10">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 opacity-80 group-hover:opacity-100 transition-opacity shadow-lg`}>
                      <Icon className="w-[18px] h-[18px] text-white" />
                    </div>
                    <h3 className="text-[15px] font-semibold text-foreground mb-2.5 flex items-center gap-2">
                      {f.title}
                      <ArrowUpRight className="w-3.5 h-3.5 text-zinc-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </h3>
                    <p className="text-[13px] text-zinc-500 leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FB3640]/[0.02] to-transparent pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7 }} className="max-w-2xl mx-auto text-center relative z-10">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FB3640] to-[#d62830] flex items-center justify-center mx-auto mb-10 shadow-[0_0_60px_rgba(251,54,64,0.15)]"
          >
            <CheckCircle2 className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
            Ready to ship?
          </h2>
          <p className="text-zinc-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Stop managing spreadsheets. Start managing outcomes.
          </p>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 0 50px rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/signup")}
            className="group px-10 py-4 rounded-xl bg-white text-zinc-900 font-semibold text-[15px] flex items-center gap-3 mx-auto transition-all"
          >
            Create Your Workspace
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </section>

      <footer className="border-t border-white/[0.03] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#FB3640] to-[#d62830] flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium text-zinc-500">TaskFlow</span>
          </div>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Security", "Status"].map(link => (
              <span key={link} className="text-[12px] text-zinc-700 hover:text-zinc-400 cursor-pointer transition-colors">{link}</span>
            ))}
          </div>
          <p className="text-[11px] text-zinc-800">© 2026 TaskFlow Inc.</p>
        </div>
      </footer>
    </div>
  );
}
