"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Lock, Mail, ArrowRight, Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      }
    }
  }, [router]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Strict role check for Admin Portal
        if (data.user.role !== "ADMIN") {
          setError("Access Denied: You do not have Administrative privileges.");
          setLoading(false);
          return;
        }

        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Invalid Admin Credentials.");
      }
    } catch (err) {
      setError("A secure connection to the server could not be established.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative z-10 space-y-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-[10px] uppercase font-black tracking-widest group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Public Site
        </Link>

        {/* Admin Branding */}
        <div className="flex flex-col items-center text-center space-y-4">
           <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center shadow-2xl relative group">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <ShieldAlert className="w-8 h-8 text-blue-500 relative z-10" />
           </div>
           
           <div className="space-y-1">
             <div className="flex items-center justify-center gap-2">
                <div className="h-px w-8 bg-slate-800"></div>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Secure Portal</span>
                <div className="h-px w-8 bg-slate-800"></div>
             </div>
             <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">ADMIN CONSOLE</h1>
             <p className="text-slate-500 text-xs font-bold font-mono tracking-tight uppercase px-4 pt-2">
               Unauthorized Access Prohibited.
             </p>
           </div>
        </div>

        {/* Login Form */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 shadow-2xl relative">
           {error && (
             <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-4 duration-300">
               ⚠️ ERROR: {error}
             </div>
           )}

           <form onSubmit={handleAdminLogin} className="space-y-6">
              <div className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity (Email)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-500 transition-colors">
                      <Mail className="w-4 h-4 text-slate-600" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500 transition-all font-mono"
                      placeholder="bikers@gmail.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Key (Password)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-500 transition-colors">
                      <Lock className="w-4 h-4 text-slate-600" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500 transition-all font-mono"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full group relative bg-white hover:bg-blue-500 hover:text-white text-black py-4 font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden mt-4"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Initialize Session
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
                <div className="absolute inset-0 bg-blue-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
           </form>
        </div>

        {/* Security Notice */}
        <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest px-2">
           <span>Session Encrypted (TLS 1.3)</span>
           <span>IP: Logged</span>
        </div>
      </div>
    </div>
  );
}
