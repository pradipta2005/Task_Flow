"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderPlus, Loader2, Users } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function ProjectsPage() {
  const auth = useAuth();
  const isAdmin = auth?.role === "ADMIN";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) setProjects(await res.json());
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (res.ok) {
        setName("");
        setDescription("");
        fetchProjects();
      } else {
        const data = await res.json();
        alert(data.error || "Could not create project.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-[1200px]">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Projects
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          {isAdmin
            ? "Manage and oversee all team initiatives"
            : "View team projects and their progress"}
        </p>
      </div>

      <div
        className={`grid grid-cols-1 ${
          isAdmin ? "lg:grid-cols-3" : ""
        } gap-8`}
      >
        <div className={`${isAdmin ? "lg:col-span-2" : ""} space-y-3`}>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 bg-white/[0.02] rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <AnimatePresence>
              {projects.map((project: any, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-5 rounded-2xl group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-[2px] h-full bg-transparent group-hover:bg-white/20 transition-all duration-300" />

                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-[15px] font-semibold text-foreground group-hover:text-white transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-[13px] text-zinc-500 mt-1 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <div className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.04] text-[10px] text-zinc-600 font-mono">
                      {project.id.slice(0, 8)}
                    </div>
                  </div>

                  <div className="flex items-center gap-5 mt-4 pt-3 border-t border-white/[0.03]">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                      <Users className="w-3 h-3" />
                      {project.owner?.name || "Unknown"}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                      <div className="w-1 h-1 rounded-full bg-emerald-400" />
                      {project._count?.tasks || 0} tasks
                    </div>
                    {project.members?.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                        <Users className="w-3 h-3" />
                        {project.members.length} member
                        {project.members.length !== 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {projects.length === 0 && (
                <div className="text-center py-16 glass-card rounded-2xl">
                  <FolderPlus className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                  <h3 className="text-sm font-medium text-foreground">
                    No Projects Yet
                  </h3>
                  <p className="text-[13px] text-zinc-600 mt-1">
                    {isAdmin
                      ? "Create one to get started."
                      : "No projects available."}
                  </p>
                </div>
              )}
            </AnimatePresence>
          )}
        </div>

        {isAdmin && (
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5 rounded-2xl sticky top-8"
            >
              <h3 className="text-[10px] font-semibold text-foreground mb-5 flex items-center gap-2 uppercase tracking-wider">
                <FolderPlus className="w-3.5 h-3.5 text-zinc-400" />
                New Project
              </h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-dark"
                    placeholder="Q3 Marketing Campaign"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="input-dark resize-none"
                    placeholder="Project goals..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="btn-primary mt-1"
                >
                  {isCreating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Create Project"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
