"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Bike,
} from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const body =
      mode === "login"
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Something went wrong" });
      } else {
        setMessage({ type: "success", text: data.message });
        if (mode === "login") {
          // Store user info in localStorage
          localStorage.setItem("user", JSON.stringify(data.user));
          setTimeout(() => router.push("/"), 1200);
        } else {
          // Auto-switch to login after signup
          setTimeout(() => {
            setMode("login");
            setFormData({ name: "", email: formData.email, password: "" });
            setMessage(null);
          }, 1500);
        }
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-start justify-center relative overflow-hidden px-4 pt-32 pb-20">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:30px_30px] opacity-50" />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#ffc800]/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#ffc800] rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <Bike className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="text-2xl font-black italic tracking-tighter uppercase text-white leading-none">
              HIMALAYAN <span className="text-[#ffc800]">RIDER</span>
            </div>
            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mt-0.5">Ride Your Freedom</div>
          </div>
        </div>

        {/* Card */}
        <div className="relative">
          {/* Shadow layer */}
          <div className="absolute inset-0 -skew-x-2 bg-[#ffc800]/20 translate-y-2 translate-x-1 blur-sm rounded-none" />

          <div className="relative bg-[#1e293b] border border-white/10 p-8 -skew-x-1">
            <div className="skew-x-1">

              {/* Mode Toggle */}
              <div className="flex bg-[#0f172a] border border-white/10 p-1 mb-8">
                {(["login", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setMessage(null); setFormData({ name: "", email: "", password: "" }); }}
                    className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                      mode === m
                        ? "bg-[#ffc800] text-black shadow-md"
                        : "text-slate-500 hover:text-white"
                    }`}
                  >
                    {m === "login" ? "Login" : "Sign Up"}
                  </button>
                ))}
              </div>

              {/* Heading */}
              <div className="mb-6">
                <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                  {mode === "login" ? "Welcome Back" : "Create Account"}
                </h1>
                <p className="text-slate-500 text-xs font-bold mt-1.5">
                  {mode === "login"
                    ? "Login to manage your bookings"
                    : "Join Himalayan Rider and start riding today"}
                </p>
              </div>

              {/* Alert */}
              {message && (
                <div
                  className={`flex items-center gap-3 px-4 py-3 mb-6 border text-sm font-bold ${
                    message.type === "success"
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  {message.text}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name — signup only */}
                {mode === "signup" && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                    <div className="flex items-center bg-[#0f172a] border border-white/10 hover:border-[#ffc800]/40 focus-within:border-[#ffc800]/60 transition-colors h-12 px-4 gap-3">
                      <User className="w-4 h-4 text-slate-500 shrink-0" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="bg-transparent w-full text-sm font-bold text-white outline-none placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                  <div className="flex items-center bg-[#0f172a] border border-white/10 hover:border-[#ffc800]/40 focus-within:border-[#ffc800]/60 transition-colors h-12 px-4 gap-3">
                    <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="bg-transparent w-full text-sm font-bold text-white outline-none placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                    {mode === "login" && (
                      <Link href="#" className="text-[9px] font-black text-[#ffc800] uppercase tracking-widest hover:underline">
                        Forgot?
                      </Link>
                    )}
                  </div>
                  <div className="flex items-center bg-[#0f172a] border border-white/10 hover:border-[#ffc800]/40 focus-within:border-[#ffc800]/60 transition-colors h-12 px-4 gap-3">
                    <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={mode === "signup" ? "Min. 6 characters" : "••••••••"}
                      required
                      minLength={6}
                      className="bg-transparent w-full text-sm font-bold text-white outline-none placeholder:text-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="text-slate-500 hover:text-[#ffc800] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {mode === "signup" && (
                    <p className="text-slate-600 text-[9px] font-bold uppercase tracking-wider">Must be at least 6 characters</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-[#ffc800] hover:bg-white text-black font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      {mode === "login" ? "Logging in..." : "Creating Account..."}
                    </span>
                  ) : (
                    <>
                      {mode === "login" ? "Login" : "Create Account"}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Switch mode */}
              <p className="text-center text-slate-500 text-xs font-bold mt-6">
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(null); setFormData({ name: "", email: "", password: "" }); }}
                  className="text-[#ffc800] hover:underline font-black"
                >
                  {mode === "login" ? "Sign Up" : "Login"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
