"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, Calendar, LogOut, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth/user");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#ffc800] transition-colors text-[10px] font-black uppercase tracking-[0.2em] mb-12 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Profile Header */}
        <div className="relative mb-12">
          <div className="absolute inset-0 -skew-x-2 bg-[#ffc800]/10 translate-y-2 translate-x-1 blur-sm rounded-none" />
          <div className="relative bg-[#1e293b] border border-white/10 p-8 md:p-12 -skew-x-1 flex flex-col md:flex-row items-center gap-8 md:gap-12">
             <div className="skew-x-1">
                <div className="w-32 h-32 bg-[#ffc800] rounded-none -skew-x-6 flex items-center justify-center shadow-2xl shadow-yellow-500/20">
                  <span className="text-5xl font-black text-black skew-x-6">{user.name.charAt(0)}</span>
                </div>
             </div>
             
             <div className="skew-x-1 flex-1 text-center md:text-left">
               <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-2">{user.name}</h1>
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                 <span className="bg-[#ffc800] text-black text-[9px] font-black px-3 py-1 uppercase tracking-widest">{user.role}</span>
                 <span className="text-slate-500 text-xs font-bold flex items-center gap-2">
                   <Mail className="w-4 h-4" /> {user.email}
                 </span>
               </div>
             </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-[#1e293b] border border-white/10 p-8 space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#ffc800] flex items-center gap-3">
                <Shield className="w-4 h-4" /> Account Security
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                   <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Status</span>
                   <span className="text-green-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Active Account
                   </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                   <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Two-Factor</span>
                   <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Disabled</span>
                </div>
              </div>
           </div>

           <div className="bg-[#1e293b] border border-white/10 p-8 space-y-6">
               <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#ffc800] flex items-center gap-3">
                <Calendar className="w-4 h-4" /> Activity & Bookings
              </h2>
              <div className="space-y-4">
                 <div className="p-4 bg-[#0f172a] border border-white/5">
                    <p className="text-[10px] font-bold text-slate-300">Last login: Today at 12:45 PM</p>
                    <p className="text-[9px] text-slate-500 mt-1 uppercase font-black tracking-widest">Success from Kanpur, IN</p>
                 </div>
                 <Link href="/bookings" className="block w-full py-3 border border-white/10 text-center text-[9px] font-black uppercase tracking-widest hover:bg-[#ffc800] hover:text-black transition-all">
                    View My Bookings
                 </Link>
                 <button className="w-full py-3 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                   View Full Activity History
                 </button>
              </div>
           </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-12 pt-12 border-t border-white/5">
           <button 
             onClick={() => {
               localStorage.removeItem("user");
               router.push("/");
               router.refresh();
             }}
             className="flex items-center gap-3 text-red-500 hover:text-red-400 font-black uppercase tracking-widest text-[10px] group transition-all"
           >
             <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             Permanently Sign Out Account
           </button>
        </div>
      </main>
    </div>
  );
}
