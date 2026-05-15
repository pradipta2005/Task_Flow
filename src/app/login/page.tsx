"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Zap } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Login failed"); }
      router.push("/dashboard");
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-white/[0.015] blur-[150px] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-md p-8 glass rounded-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FB3640] to-[#d62830] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-foreground tracking-tight">TaskFlow</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome Back</h1>
          <p className="text-zinc-500 mt-1.5 text-[13px]">Sign in to your dashboard</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input-dark" placeholder="admin@company.com" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input-dark" placeholder="••••••••" />
          </div>
          {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#FB3640] text-[13px] text-center font-medium">{error}</motion.p>}
          <button type="submit" disabled={loading} className="btn-primary">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}</button>
        </form>
        <p className="text-center mt-6 text-[13px] text-zinc-500">Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-foreground hover:text-white transition-colors font-medium">Request Access</Link>
        </p>
      </motion.div>
    </div>
  );
}
