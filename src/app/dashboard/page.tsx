"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  FolderKanban,
  AlertCircle,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";

export default function DashboardOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 bg-white/[0.02] rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  const stats = [
    {
      name: "Active Projects",
      value: data?.summary?.totalProjects || 0,
      icon: FolderKanban,
      color: "text-violet-400",
      bg: "bg-violet-500/8",
    },
    {
      name: "In Progress",
      value: data?.summary?.inProgressTasks || 0,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-400/8",
    },
    {
      name: "Completed",
      value: data?.summary?.completedTasks || 0,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-400/8",
    },
    {
      name: "Overdue",
      value: data?.summary?.overdueCount || 0,
      icon: AlertCircle,
      color: data?.summary?.overdueCount > 0 ? "text-[#FB3640]" : "text-zinc-500",
      bg: data?.summary?.overdueCount > 0 ? "bg-[#FB3640]/8" : "bg-zinc-800/50",
    },
  ];

  return (
    <div className="space-y-8 max-w-[1200px]">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          {data?.role === "ADMIN" ? "Team-wide overview" : "Your task overview"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="stat-card group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2">
                    {stat.name}
                  </p>
                  <h3 className="text-2xl font-semibold text-foreground">
                    {stat.value}
                  </h3>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} transition-transform group-hover:scale-105`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {data?.teamStats && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card rounded-2xl p-5 flex items-center gap-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/8 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                Team Size
              </p>
              <p className="text-lg font-semibold text-foreground">
                {data.teamStats.totalMembers}
              </p>
            </div>
          </div>
          <div className="w-px h-10 bg-white/[0.04]" />
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
              Team Completion Rate
            </p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full w-40 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.teamStats.teamCompletionRate}%` }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
              <span className="text-sm font-semibold text-foreground">
                {data.teamStats.teamCompletionRate}%
              </span>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {data?.overdueTasks?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 glass-card p-5 rounded-2xl border-[#FB3640]/10"
          >
            <h3 className="text-[10px] font-semibold text-foreground flex items-center gap-2 mb-4 uppercase tracking-wider">
              <AlertCircle className="w-3.5 h-3.5 text-[#FB3640]" />
              Action Required
            </h3>
            <div className="space-y-2">
              {data.overdueTasks.map((task: any) => (
                <div
                  key={task.id}
                  className="p-3 rounded-lg bg-[#FB3640]/[0.04] border border-[#FB3640]/10 transition-all hover:border-[#FB3640]/20"
                >
                  <h4 className="font-medium text-foreground text-[13px]">
                    {task.title}
                  </h4>
                  <p className="text-[11px] text-[#FB3640]/60 mt-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`glass-card p-5 rounded-2xl ${
            data?.overdueTasks?.length > 0 ? "lg:col-span-2" : "lg:col-span-3"
          }`}
        >
          <h3 className="text-[10px] font-semibold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Recent Activity
          </h3>
          <div className="space-y-1">
            {data?.recentTasks?.map((task: any, i: number) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.04 }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      task.status === "DONE"
                        ? "bg-emerald-400"
                        : task.status === "IN_PROGRESS"
                        ? "bg-amber-400"
                        : "bg-blue-400"
                    }`}
                  />
                  <div>
                    <h4 className="font-medium text-foreground text-[13px]">
                      {task.title}
                    </h4>
                    <p className="text-[11px] text-zinc-600 mt-0.5">
                      {task.project?.name || "No Project"}
                      {task.assignee?.name && ` · ${task.assignee.name}`}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                    task.status === "DONE"
                      ? "badge-green"
                      : task.status === "IN_PROGRESS"
                      ? "badge-amber"
                      : "badge-blue"
                  }`}
                >
                  {task.status.replace("_", " ")}
                </span>
              </motion.div>
            ))}
            {data?.recentTasks?.length === 0 && (
              <p className="text-zinc-600 text-sm text-center py-10">
                No recent tasks. Create one to get started.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
