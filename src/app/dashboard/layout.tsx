"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  LogOut,
  User as UserIcon,
  Zap,
  Users,
  ChevronRight,
} from "lucide-react";

interface AuthUser {
  userId: string;
  role: string;
}

const AuthContext = createContext<AuthUser | null>(null);
export const useAuth = () => useContext(AuthContext);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  const isAdmin = user?.role === "ADMIN";

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
    { name: "Task Board", href: "/dashboard/tasks", icon: CheckSquare },
    ...(isAdmin ? [{ name: "Team", href: "/dashboard/team", icon: Users }] : []),
    { name: "Profile", href: "/dashboard/profile", icon: UserIcon },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
          <p className="text-xs text-zinc-500 uppercase tracking-widest">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={user}>
      <div className="flex h-screen bg-[#09090b] overflow-hidden">
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-[252px] glass flex-col justify-between hidden md:flex flex-shrink-0"
        >
          <div className="p-5">
            <div className="flex items-center gap-2.5 mb-10 px-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FB3640] to-[#d62830] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-[15px] tracking-tight text-foreground">
                TaskFlow
              </span>
            </div>

            <nav className="space-y-0.5">
              {links.map((link) => {
                const isActive =
                  link.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-[13px] ${
                      isActive
                        ? "bg-white/[0.06] text-foreground font-medium"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]"
                    }`}
                  >
                    <Icon className="w-[16px] h-[16px]" />
                    <span className="flex-1">{link.name}</span>
                    {isActive && (
                      <ChevronRight className="w-3 h-3 text-zinc-600" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-5 border-t border-white/[0.04]">
            <div className="px-3 mb-3">
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded ${
                  isAdmin
                    ? "bg-[#FB3640]/8 text-[#FB3640] border border-[#FB3640]/15"
                    : "bg-blue-500/8 text-blue-400 border border-blue-500/15"
                }`}
              >
                {user?.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] w-full text-[13px]"
            >
              <LogOut className="w-[16px] h-[16px]" />
              Sign Out
            </button>
          </div>
        </motion.aside>

        <main className="flex-1 flex flex-col h-full overflow-hidden">
          <header className="h-14 border-b border-white/[0.04] bg-[#09090b]/80 backdrop-blur-xl flex items-center justify-between px-8 flex-shrink-0">
            <h2 className="text-[11px] font-medium text-zinc-500 uppercase tracking-[0.15em]">
              {pathname === "/dashboard"
                ? "Overview"
                : pathname.split("/").pop()?.replace(/-/g, " ")}
            </h2>
            <div className="flex items-center gap-2.5">
              <div className="dot-online animate-pulse" />
              <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
                System Online
              </span>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-8">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </AuthContext.Provider>
  );
}
