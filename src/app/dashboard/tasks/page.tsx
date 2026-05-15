"use client";
import { useEffect, useState, useOptimistic, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Calendar, Loader2, User, ChevronRight } from "lucide-react";
import { useAuth } from "../layout";
import { updateTaskStatus } from "@/app/actions/tasks";

export default function TasksPage() {
  const auth = useAuth();
  const isAdmin = auth?.role === "ADMIN";
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    tasks,
    (state: any[], { taskId, newStatus }: { taskId: string; newStatus: string }) =>
      state.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
  );

  const safeFetch = async (url: string) => {
    try {
      const r = await fetch(url);
      if (!r.ok) return [];
      const d = await r.json();
      return Array.isArray(d) ? d : [];
    } catch { return []; }
  };

  const fetchAll = async () => {
    try {
      const [t, p] = await Promise.all([safeFetch("/api/tasks"), safeFetch("/api/projects")]);
      setTasks(t);
      setProjects(p);
      if (isAdmin) { const m = await safeFetch("/api/team"); setMembers(m); }
    } catch (e) { setError("Failed to load data"); }
    finally { setLoading(false); }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchAll(); }, [isAdmin]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setIsCreating(true);
    try {
      const r = await fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, projectId, dueDate: dueDate || undefined, assignedTo: assignedTo || undefined, status: "TODO" }) });
      if (r.ok) { setTitle(""); setDueDate(""); setAssignedTo(""); setShowForm(false); fetchAll(); }
    } catch { setError("Failed to create task"); }
    finally { setIsCreating(false); }
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    startTransition(async () => {
      setOptimisticTasks({ taskId, newStatus });
      const result = await updateTaskStatus(taskId, newStatus);
      if (result.error) { fetchAll(); }
      else { setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t)); }
    });
  };

  const columns = [
    { key: "TODO", label: "Todo", dot: "bg-blue-400", next: "IN_PROGRESS", nextLabel: "Start" },
    { key: "IN_PROGRESS", label: "In Progress", dot: "bg-amber-400", next: "DONE", nextLabel: "Complete" },
    { key: "DONE", label: "Completed", dot: "bg-emerald-400", next: null, nextLabel: null },
  ];

  if (error && !loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <p className="text-sm text-[#FB3640]">{error}</p>
      <button onClick={() => { setError(""); setLoading(true); fetchAll(); }}
        className="px-4 py-2 rounded-lg bg-white/[0.06] text-sm text-foreground border border-white/[0.06]">Retry</button>
    </div>
  );

  return (
    <div className="h-full flex flex-col space-y-5 max-w-[1200px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Task Board</h1>
          <p className="text-sm text-zinc-500 mt-1">{isAdmin ? "Manage your execution pipeline" : "Your assigned tasks"}</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.05] text-foreground text-[13px] font-medium hover:bg-white/[0.08] transition-all border border-white/[0.06]">
            <Plus className="w-3.5 h-3.5" /> New Task
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && isAdmin && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreate} className="glass-card p-5 rounded-2xl space-y-4 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5 lg:col-span-2">
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Task Title</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="input-dark" placeholder="Design the landing page..." />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Project</label>
                <select required value={projectId} onChange={e => setProjectId(e.target.value)} className="input-dark">
                  <option value="" disabled>Select project</option>
                  {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Assign To</label>
                <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className="input-dark">
                  <option value="">Unassigned</option>
                  {members.map((m: any) => <option key={m.id} value={m.id}>{m.name || m.email}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-end gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Due Date</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="input-dark dark:[color-scheme:dark]" />
              </div>
              <button type="submit" disabled={isCreating || !projectId}
                className="px-6 py-3 rounded-lg bg-white/[0.06] text-foreground text-[13px] font-medium hover:bg-white/[0.09] transition-all disabled:opacity-40 border border-white/[0.06]">
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Task"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex-1 flex items-center justify-center"><Loader2 className="w-5 h-5 text-zinc-600 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 min-h-0">
          {columns.map(col => {
            const colTasks = optimisticTasks.filter(t => t.status === col.key);
            return (
              <div key={col.key} className="flex flex-col h-full glass-card rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.03]">
                  <h3 className="text-[10px] font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />{col.label}
                  </h3>
                  <span className="text-[10px] font-semibold text-zinc-600 bg-white/[0.03] px-2 py-0.5 rounded">{colTasks.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  <AnimatePresence>
                    {colTasks.map(task => (
                      <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={task.id} className="kanban-card">
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white/[0.03] text-zinc-600 uppercase tracking-wider">{task.project?.name || "Task"}</span>
                        <h4 className="text-[13px] font-medium text-foreground leading-snug mt-2">{task.title}</h4>
                        {task.assignee && <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mt-2"><User className="w-3 h-3" />{task.assignee.name || task.assignee.email}</div>}
                        {task.dueDate && <div className={`flex items-center gap-1 text-[10px] mt-2 ${new Date(task.dueDate) < new Date() && task.status !== "DONE" ? "text-[#FB3640]" : "text-zinc-600"}`}><Calendar className="w-3 h-3" />{new Date(task.dueDate).toLocaleDateString()}</div>}
                        {col.next && (
                          <button onClick={() => handleStatusChange(task.id, col.next!)} disabled={isPending}
                            className="mt-3 w-full flex items-center justify-center gap-1 py-1.5 rounded-md text-[10px] font-medium text-zinc-400 bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:text-zinc-300 transition-all disabled:opacity-40">
                            {col.nextLabel}<ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {colTasks.length === 0 && <div className="text-center py-8 text-[11px] text-zinc-700">No tasks</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
