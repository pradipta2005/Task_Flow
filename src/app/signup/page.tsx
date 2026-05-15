"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Zap } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "MEMBER" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Registration failed"); }
      router.push("/dashboard");
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] relative overflow-hidden">
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white/[0.015] blur-[150px] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-md p-8 glass rounded-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FB3640] to-[#d62830] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-foreground tracking-tight">TaskFlow</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create Account</h1>
          <p className="text-zinc-500 mt-1.5 text-[13px]">Join the executive platform</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Full Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-dark" placeholder="John Doe" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Email</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="input-dark" placeholder="admin@company.com" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Password</label>
            <input type="password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="input-dark" placeholder="••••••••" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">Role</label>
            <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="input-dark">
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#FB3640] text-[13px] text-center font-medium">{error}</motion.p>}
          <button type="submit" disabled={loading} className="btn-primary mt-1">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}</button>
        </form>
        <p className="text-center mt-6 text-[13px] text-zinc-500">Already have an account?{" "}
          <Link href="/login" className="text-foreground hover:text-white transition-colors font-medium">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}
