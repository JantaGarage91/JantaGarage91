"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowRight, 
  UserCircle2, 
  Lock, 
  ChevronLeft,
  Wrench,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function WorkerLogin() {
  const [workerId, setWorkerId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "WORKER") {
        router.push("/worker/dashboard");
      }
    }
  }, [router]);

  const handleWorkerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/worker/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.worker));
        router.push("/worker/dashboard");
      } else {
        setError(data.error || "Verification failed. Check your ID and passcode.");
      }
    } catch (err) {
      setError("Unable to connect to the Staff Registry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 relative overflow-hidden font-sansSelection">
      {/* Dark Garage Aesthetic Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
         <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Main Content Hub */}
      <div className="relative z-10 w-full flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
           
           <div className="flex flex-col items-center space-y-4">
              <Link href="/" className="group flex items-center gap-3 bg-[#1e293b] p-3 -skew-x-12 border border-white/5 shadow-2xl">
                 <div className="skew-x-12 w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-black">
                   <Wrench className="w-5 h-5" />
                 </div>
                 <div className="skew-x-12 text-white font-black uppercase tracking-tighter italic">
                    STAFF <span className="text-emerald-500">PORTAL</span>
                 </div>
              </Link>
              <div className="text-center">
                 <h1 className="text-3xl font-black text-white uppercase tracking-tighter">WORKER LOGIN</h1>
                 <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em] mt-1">Authorized Personnel Only</p>
              </div>
           </div>

           {/* High-Performance Login Card */}
           <div className="relative">
              {/* Skewed Hub Frame */}
              <div className="absolute inset-0 -skew-x-3 bg-[#0f172a] border-[3px] border-emerald-500/50 shadow-[0_40px_100px_rgba(16,185,129,0.1)]"></div>
              
              <div className="relative z-10 p-8 md:p-10 flex flex-col space-y-8">
                 
                 {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 -skew-x-12 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                       <AlertCircle className="w-4 h-4 text-red-500 skew-x-12" />
                       <span className="text-[10px] font-black text-red-500 uppercase tracking-widest skew-x-12">{error}</span>
                    </div>
                 )}

                 {/* Auth Elements */}
                 <form onSubmit={handleWorkerLogin} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Worker ID</label>
                       <div className="relative -skew-x-12 bg-slate-900 border border-white/5 hover:border-emerald-500/50 transition-all h-[52px] flex items-center overflow-hidden">
                          <div className="skew-x-12 px-5 flex items-center w-full gap-4">
                             <UserCircle2 className="w-5 h-5 text-emerald-500/40" />
                             <input 
                               type="text" 
                               required
                               value={workerId}
                               onChange={(e) => setWorkerId(e.target.value.toUpperCase())}
                               placeholder="e.g. WRK-001"
                               className="bg-transparent w-full text-sm font-black text-white outline-none placeholder:text-slate-600"
                             />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <div className="flex justify-between items-end px-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passcode</label>
                          <Link href="#" className="text-[9px] font-black text-emerald-500 uppercase tracking-widest hover:underline">Forgot?</Link>
                       </div>
                       <div className="relative -skew-x-12 bg-slate-900 border border-white/5 hover:border-emerald-500/50 transition-all h-[52px] flex items-center overflow-hidden">
                          <div className="skew-x-12 px-5 flex items-center w-full gap-4">
                             <Lock className="w-5 h-5 text-emerald-500/40" />
                             <input 
                               type="password" 
                               required
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               placeholder="••••••••"
                               className="bg-transparent w-full text-sm font-black text-white outline-none placeholder:text-slate-600"
                             />
                          </div>
                       </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full relative -skew-x-12 h-[56px] bg-emerald-500 hover:bg-white text-black font-black uppercase tracking-[0.2em] transition-all pt-1 active:scale-95 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 overflow-hidden group"
                    >
                       <div className="skew-x-12 flex items-center gap-3">
                         {isLoading ? (
                            <>
                               <Loader2 className="w-5 h-5 animate-spin" />
                               <span>Verifying...</span>
                            </>
                         ) : (
                            <>
                               <span>Access System</span>
                               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                         )}
                       </div>
                    </button>
                 </form>

              </div>
           </div>

           {/* Return Portal */}
           <div className="flex justify-center text-center">
              <Link href="/" className="group flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-colors text-[10px] font-black uppercase tracking-widest">
                 <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                 Return to Homepage
              </Link>
           </div>

        </div>
      </div>
    </div>
  );
}
