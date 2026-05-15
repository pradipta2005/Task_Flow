"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, FolderKanban, Loader2, Shield, CheckCircle2, Clock } from "lucide-react";
import { useAuth } from "../layout";
import { useRouter } from "next/navigation";

export default function TeamPage() {
  const auth = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignUserId, setAssignUserId] = useState("");
  const [assignProjectId, setAssignProjectId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (auth && auth.role !== "ADMIN") { router.push("/dashboard"); return; }
    Promise.all([
      fetch("/api/team").then(r => r.json()).then(d => Array.isArray(d) ? d : []),
      fetch("/api/projects").then(r => r.json()).then(d => Array.isArray(d) ? d : []),
    ]).then(([u, p]) => { setUsers(u); setProjects(p); setLoading(false); })
      .catch(() => setLoading(false));
  }, [auth, router]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault(); setAssigning(true); setMessage("");
    try {
      const r = await fetch("/api/team/assign", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: assignUserId, projectId: assignProjectId }) });
      const data = await r.json();
      if (r.ok) { setMessage("Member assigned successfully"); setAssignUserId(""); setAssignProjectId(""); }
      else setMessage(data.error || "Failed to assign");
    } catch { setMessage("Network error"); }
    finally { setAssigning(false); }
  };

  if (auth?.role !== "ADMIN") return null;

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Team Management</h1>
        <p className="text-sm text-zinc-500 mt-1">View team workload and manage project assignments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Team Members", value: users.length, icon: Users, color: "text-blue-400", bg: "bg-blue-400/8" },
          { label: "Active Projects", value: projects.length, icon: FolderKanban, color: "text-violet-400", bg: "bg-violet-400/8" },
          { label: "Total Active Tasks", value: users.reduce((s,u) => s + u.activeTasks, 0), icon: Clock, color: "text-amber-400", bg: "bg-amber-400/8" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="stat-card group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">{s.label}</p>
                  <h3 className="text-2xl font-semibold text-foreground">{s.value}</h3>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg} ${s.color}`}><Icon className="w-[18px] h-[18px]" /></div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.03]">
            <h3 className="text-[10px] font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-zinc-400" />Registered Users
            </h3>
          </div>
          {loading ? (
            <div className="p-10 flex justify-center"><Loader2 className="w-5 h-5 text-zinc-600 animate-spin" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Active Tasks</th>
                    <th>Total Tasks</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 + i * 0.04 }}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[11px] font-semibold text-zinc-400">
                            {u.name?.[0]?.toUpperCase() || u.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-foreground">{u.name || "—"}</p>
                            <p className="text-[11px] text-zinc-600">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${u.role === 'ADMIN' ? 'bg-[#FB3640]/8 text-[#FB3640] border border-[#FB3640]/15' : 'bg-blue-500/8 text-blue-400 border border-blue-500/15'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 bg-white/[0.04] rounded-full max-w-[60px] overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.min(u.activeTasks * 20, 100)}%` }} />
                          </div>
                          <span className="text-[13px] font-medium">{u.activeTasks}</span>
                        </div>
                      </td>
                      <td><span className="text-[13px] text-zinc-400">{u.totalTasks}</span></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-1">
          <div className="glass-card p-5 rounded-2xl sticky top-8">
            <h3 className="text-[10px] font-semibold text-foreground mb-5 flex items-center gap-2 uppercase tracking-wider">
              <UserPlus className="w-3.5 h-3.5 text-zinc-400" />Assign to Project
            </h3>
            <form onSubmit={handleAssign} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Member</label>
                <select required value={assignUserId} onChange={e => setAssignUserId(e.target.value)} className="input-dark">
                  <option value="" disabled>Select member</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Project</label>
                <select required value={assignProjectId} onChange={e => setAssignProjectId(e.target.value)} className="input-dark">
                  <option value="" disabled>Select project</option>
                  {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <button type="submit" disabled={assigning || !assignUserId || !assignProjectId} className="btn-primary">
                {assigning ? <Loader2 className="w-4 h-4 animate-spin" /> : "Assign Member"}
              </button>
              {message && <p className={`text-[11px] text-center font-medium ${message.includes('success') ? 'text-emerald-400' : 'text-[#FB3640]'}`}>{message}</p>}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
