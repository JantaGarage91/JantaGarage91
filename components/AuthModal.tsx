"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Bike, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  ArrowRight,
  CheckCircle2,
  AlertCircle 
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const body = mode === "login"
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
          localStorage.setItem("user", JSON.stringify(data.user));
          onSuccess(data.user);
          setTimeout(() => {
            onClose();
          }, 1000);
        } else {
          setTimeout(() => {
            setMode("login");
            setFormData({ name: "", email: formData.email, password: "" });
            setMessage(null);
          }, 1500);
        }
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
        <div className="absolute inset-0 -skew-x-2 bg-[#ffc800]/20 translate-y-2 translate-x-1 blur-sm rounded-none" />
        
        <div className="relative bg-[#1e293b] border border-white/10 p-8 -skew-x-2 shadow-2xl">
          <div className="skew-x-2">
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute -top-4 -right-4 p-2 bg-white text-black hover:bg-[#ffc800] transition-colors -skew-x-12"
            >
              <X className="w-4 h-4 skew-x-12" />
            </button>

            {/* Brand */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#ffc800] rounded-xl flex items-center justify-center">
                <Bike className="w-5 h-5 text-black" />
              </div>
              <div className="text-2xl font-black italic tracking-tighter uppercase text-white">
                HIMALAYAN <span className="text-[#ffc800]">RIDER</span>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-[#0f172a] border border-white/10 p-1 mb-6">
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setMessage(null); setFormData({ name: "", email: "", password: "" }); }}
                  className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                    mode === m ? "bg-[#ffc800] text-black" : "text-slate-500 hover:text-white"
                  }`}
                >
                  {m === "login" ? "Login" : "Sign Up"}
                </button>
              ))}
            </div>

            <div className="mb-6 text-center">
              <h1 className="text-xl font-black text-white uppercase tracking-tighter">
                {mode === "login" ? "Authentication Required" : "Create Fleet Identity"}
              </h1>
              <p className="text-slate-500 text-[10px] font-bold mt-1 uppercase tracking-wider">
                {mode === "login" 
                  ? "Access the elite fleet by verifying your identity." 
                  : "Join the elite machine network today."}
              </p>
            </div>

            {/* Alert */}
            {message && (
              <div className={`flex items-center gap-3 px-4 py-3 mb-6 border text-xs font-bold ${
                message.type === "success" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}>
                {message.type === "success" ? <CheckCircle2 className="w-3 h-3 shrink-0" /> : <AlertCircle className="w-3 h-3 shrink-0" />}
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="flex items-center bg-[#0f172a] border border-white/5 focus-within:border-[#ffc800]/50 h-11 px-4 gap-3 transition-colors">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="bg-transparent w-full text-xs font-bold text-white outline-none placeholder:text-slate-600"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="flex items-center bg-[#0f172a] border border-white/5 focus-within:border-[#ffc800]/50 h-11 px-4 gap-3 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="bg-transparent w-full text-xs font-bold text-white outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="flex items-center bg-[#0f172a] border border-white/5 focus-within:border-[#ffc800]/50 h-11 px-4 gap-3 transition-colors">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="bg-transparent w-full text-xs font-bold text-white outline-none placeholder:text-slate-600"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-500 hover:text-white">
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#ffc800] hover:bg-white text-black font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? "Processing..." : (mode === "login" ? "Login Now" : "Join Now")}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <button 
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(null); }}
              className="w-full text-center text-slate-500 text-[10px] font-black uppercase tracking-widest mt-6 hover:text-[#ffc800] transition-colors"
            >
              {mode === "login" ? "Need an account? Sign Up" : "Already a member? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
