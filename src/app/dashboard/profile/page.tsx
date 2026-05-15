"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, ShieldCheck, CheckCircle2, Clock, ListTodo, Activity, FolderKanban, Users, AlertCircle, Calendar, RefreshCw } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setProfile(data);
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  if (loading) return (
    <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
      <div className="h-44 bg-white/[0.02] rounded-2xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-24 bg-white/[0.02] rounded-2xl" />)}</div>
      <div className="h-48 bg-white/[0.02] rounded-2xl" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 rounded-2xl bg-[#FB3640]/10 flex items-center justify-center">
        <AlertCircle className="w-5 h-5 text-[#FB3640]" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">Profile Error</h2>
      <p className="text-sm text-zinc-500">{error}</p>
      <button onClick={fetchProfile} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white/[0.06] text-sm font-medium text-foreground border border-white/[0.06] hover:bg-white/[0.09] transition-colors">
        <RefreshCw className="w-3.5 h-3.5" /> Retry
      </button>
    </div>
  );

  if (!profile) return null;

  const { user, stats, isAdmin } = profile;
  const completionRate = stats?.completionRate ?? 0;
  const todoCount = stats?.todo ?? 0;
  const inProgressCount = stats?.inProgress ?? 0;
  const doneCount = stats?.done ?? 0;
  const overdueCount = stats?.overdueCount ?? 0;

  const statCards = [
    { label: "Todo", value: todoCount, icon: ListTodo, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "In Progress", value: inProgressCount, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Completed", value: doneCount, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    isAdmin
      ? { label: "Projects", value: stats?.totalProjects ?? 0, icon: FolderKanban, color: "text-violet-400", bg: "bg-violet-500/10" }
      : { label: "Overdue", value: overdueCount, icon: AlertCircle, color: overdueCount > 0 ? "text-[#FB3640]" : "text-zinc-500", bg: overdueCount > 0 ? "bg-[#FB3640]/10" : "bg-zinc-800/40" },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-7 rounded-2xl">
        <div className="flex flex-col md:flex-row items-center gap-7">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] flex items-center justify-center text-2xl font-semibold text-foreground">
              {(user?.name?.[0] || user?.email?.[0] || "?").toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-[3px] border-[#09090b]" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-xl font-semibold text-foreground tracking-tight">{user?.name || "Unknown User"}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-1.5 text-zinc-500 text-[13px]">
              <Mail className="w-3.5 h-3.5" />{user?.email || "—"}
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider border"
              style={{
                background: isAdmin ? "rgba(251,54,64,0.08)" : "rgba(96,165,250,0.08)",
                borderColor: isAdmin ? "rgba(251,54,64,0.15)" : "rgba(96,165,250,0.15)",
                color: isAdmin ? "#FB3640" : "#60a5fa",
              }}>
              <ShieldCheck className="w-3 h-3" />{user?.role || "MEMBER"}
            </div>
          </div>

          <div className="text-center">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
                <motion.circle cx="50" cy="50" r="42" fill="none" stroke="#22c55e" strokeWidth="6"
                  initial={{ strokeDasharray: "0 264" }}
                  animate={{ strokeDasharray: `${completionRate * 2.64} ${264 - completionRate * 2.64}` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-semibold text-foreground">{completionRate}%</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-600 mt-1.5 uppercase tracking-wider">Completion</p>
          </div>

          <div className="text-center hidden lg:block">
            <p className="text-lg font-semibold text-foreground">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"}
            </p>
            <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-wider">Member Since</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06 }}
              className="stat-card group">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mb-1.5">{s.label}</p>
                  <p className="text-2xl font-semibold text-foreground">{s.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${s.bg} ${s.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {isAdmin && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5 rounded-2xl">
          <h3 className="text-[10px] font-semibold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-blue-400" />Team Health
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02]">
              <p className="text-2xl font-semibold text-foreground">{stats?.totalMembers ?? 0}</p>
              <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-wider">Team Members</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02]">
              <p className="text-2xl font-semibold text-foreground">{stats?.total ?? 0}</p>
              <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-wider">Total Tasks</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02]">
              <p className="text-2xl font-semibold text-foreground">{stats?.totalProjects ?? 0}</p>
              <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-wider">Projects</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02]">
              <p className={`text-2xl font-semibold ${overdueCount > 0 ? 'text-[#FB3640]' : 'text-emerald-400'}`}>
                {overdueCount > 0 ? overdueCount : '✓'}
              </p>
              <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-wider">{overdueCount > 0 ? 'Overdue' : 'All Clear'}</p>
            </div>
          </div>
        </motion.div>
      )}

      {!isAdmin && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5 rounded-2xl">
          <h3 className="text-[10px] font-semibold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-amber-400" />Active Assignments
          </h3>
          {(profile.activeTasks?.length ?? 0) > 0 ? (
            <div className="space-y-2">
              {profile.activeTasks.map((task: any) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${task.status === 'IN_PROGRESS' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                    <div>
                      <h4 className="text-[13px] font-medium text-foreground">{task.title}</h4>
                      <p className="text-[10px] text-zinc-600">{task.project?.name || "No project"}</p>
                    </div>
                  </div>
                  {task.dueDate && (
                    <span className={`text-[10px] flex items-center gap-1 ${new Date(task.dueDate) < new Date() ? 'text-[#FB3640]' : 'text-zinc-600'}`}>
                      <Calendar className="w-3 h-3" />{new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
              <p className="text-sm text-zinc-600">No active tasks. You&apos;re all caught up!</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
