"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  BarChart3, 
  Settings, 
  LogOut, 
  MessageSquare,
  UserPlus,
  Bike as BikeIcon,
  Plus,
  Trash2,
  X,
  Zap,
  Tag,
  Hash,
  CheckCircle2,
  Clock,
  Wrench,
  Loader2,
  Gift,
  AlertTriangle,
  RefreshCw,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminCoupons() {
  const [user, setUser] = useState<any>(null);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    code: "",
    discountPercent: "",
    expiryDate: ""
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/admin");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "ADMIN") {
      router.push("/");
      return;
    }
    setUser(parsedUser);
    fetchCoupons();
  }, [router]);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (res.ok) setCoupons(data);
    } catch (err) {
      console.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("Generating Secure Promotional Data...");
    
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          code: formData.code.toUpperCase(), 
          discountPercent: Number(formData.discountPercent),
          expiryDate: formData.expiryDate || undefined
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus("✅ Token Protocol Active!");
        setFormData({ code: "", discountPercent: "", expiryDate: "" });
        fetchCoupons();
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setStatus("❌ Sync Failure.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id: string, current: boolean) => {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !current })
      });
      if (res.ok) fetchCoupons();
    } catch (err) {
      alert("Toggle failed.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to PERMANENTLY remove this coupon?")) return;
    try {
        const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
        if (res.ok) {
           fetchCoupons();
           alert("Promotional Protocol Purged.");
        }
    } catch (err) {
        alert("Delete failed.");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col lg:flex-row overflow-hidden font-sans">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-5 md:p-10 pt-24 lg:p-12 lg:pt-12">
          {/* Top Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">COUPON <span className="text-[#ffc800]">REWARDS</span></h1>
              <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Promotional Protocol • Configure Reward Tokens</p>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 p-3 border border-white/5 w-full md:w-auto">
               <div className="text-right flex-1 md:flex-none">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#ffc800]">{user.name}</div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-emerald-500">ADMIN CONTROL</div>
               </div>
               <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-800 border border-slate-700 flex items-center justify-center -skew-x-6">
                  <span className="font-black text-xs text-white skew-x-6">{user.name.charAt(0)}</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
             {/* Form Section */}
             <div className="bg-[#0f172a] border border-white/5 flex flex-col p-6 md:p-8 h-fit lg:sticky lg:top-4 shadow-2xl">
                <div className="flex justify-between items-start mb-8 pb-4 border-b border-white/5">
                   <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ffc800]">
                         Provision New Token
                      </h3>
                   </div>
                </div>

                <form onSubmit={handleCreate} className="space-y-6">
                    <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Promotional Code</label>
                         <div className="relative">
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ffc800]" />
                            <input 
                              type="text" 
                              placeholder="RIDER20" 
                              required
                              value={formData.code}
                              onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                              className="w-full bg-[#020617] border border-white/10 pl-11 pr-4 py-4 text-sm font-black focus:outline-none focus:border-[#ffc800] transition-all" 
                            />
                         </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Discount (% Rate)</label>
                            <div className="relative">
                                <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                                <input 
                                    type="number" 
                                    placeholder="20" 
                                    required
                                    min="1"
                                    max="100"
                                    value={formData.discountPercent}
                                    onChange={(e) => setFormData({...formData, discountPercent: e.target.value})}
                                    className="w-full bg-[#020617] border border-white/10 pl-11 pr-4 py-4 text-sm font-black focus:outline-none focus:border-emerald-500 transition-all" 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Expiry Date</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                <input 
                                    type="date" 
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                                    className="w-full bg-[#020617] border border-white/10 pl-11 pr-4 py-4 text-sm font-black focus:outline-none focus:border-slate-600 transition-all cursor-pointer" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        {status && <div className={`mb-4 text-[9px] font-black uppercase tracking-widest ${status.includes('❌') ? 'text-rose-500' : 'text-emerald-500'}`}>{status}</div>}
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-[#ffc800] hover:bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] py-5 shadow-[0_5px_20px_rgba(255,200,0,0.2)] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            {isSubmitting ? "SYNCING..." : "ACTIVATE PROTOCOL"}
                        </button>
                    </div>
                </form>

                <div className="mt-10 p-6 bg-slate-900/30 border border-white/5 rounded-none relative overflow-hidden">
                   <div className="relative z-10">
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ffc800] mb-2 font-sans italic flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3" /> System Broadcast
                      </div>
                      <p className="text-[8px] font-bold text-slate-500 uppercase leading-relaxed tracking-wider">
                         Active tokens are globally applied to all verified rider checkouts. Monitor usage via operational receipts.
                      </p>
                   </div>
                   <Gift className="absolute -bottom-4 -right-4 w-16 h-16 text-white/5 rotate-12" />
                </div>
             </div>

             {/* List Section */}
             <div className="space-y-6">
                <div className="flex justify-between items-center bg-[#0f172a] border border-white/5 p-5">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-white italic">Active Protocols</h3>
                   <span className="text-[9px] font-black uppercase text-[#ffc800] bg-[#ffc800]/5 px-4 py-1.5 border border-[#ffc800]/20">{coupons.length} TOKENS</span>
                </div>

                <div className="bg-[#0f172a] border border-white/5 divide-y divide-white/5 shadow-xl overflow-hidden">
                   {loading ? (
                       <div className="p-16 text-center text-[9px] font-black uppercase text-slate-700 tracking-[0.5em] animate-pulse italic">Retrieving Token Registry...</div>
                   ) : coupons.length === 0 ? (
                       <div className="p-16 text-center flex flex-col items-center gap-6 opacity-30">
                           <Gift className="w-12 h-12" />
                           <span className="text-[9px] font-black uppercase tracking-widest">No active protocols detected</span>
                       </div>
                   ) : coupons.map((c) => (
                      <div key={c._id} className="p-6 md:p-8 hover:bg-white/[0.02] transition-all group border-l-2 border-transparent hover:border-[#ffc800]">
                           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="flex items-center gap-6 md:gap-10">
                                 <div>
                                    <div className="text-[9px] font-black text-[#ffc800] uppercase tracking-[0.3em] mb-1 italic">TOKEN_REF</div>
                                    <div className="text-xl md:text-2xl font-black tracking-tighter text-white italic uppercase group-hover:translate-x-1 transition-transform">{c.code}</div>
                                 </div>
                                 <div className="h-10 w-px bg-white/5"></div>
                                 <div>
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">YIELD</div>
                                    <div className="text-xl md:text-2xl font-black text-emerald-500 italic tracking-tighter">-{c.discountPercent}%</div>
                                 </div>
                              </div>
                              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-white/5 md:border-none">
                                 <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest md:mb-1 font-sans hidden sm:block">STATUS CONTROL</div>
                                 <div className="flex items-center gap-3">
                                    <button 
                                       onClick={() => toggleStatus(c._id, c.isActive)}
                                       className={`relative w-12 h-6 md:w-14 md:h-7 rounded-none border transition-all ${
                                          c.isActive ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-800 border-white/10'
                                       }`}
                                    >
                                       <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 bg-white transition-all ${
                                          c.isActive ? 'left-7 md:left-8' : 'left-1'
                                       }`}></div>
                                       <span className={`absolute top-1/2 -translate-y-1/2 text-[7px] md:text-[8px] font-black uppercase transition-all ${
                                          c.isActive ? 'left-2 text-white' : 'right-2 text-slate-500'
                                       }`}>
                                          {c.isActive ? 'ON' : 'OFF'}
                                       </span>
                                    </button>
                                    <button 
                                       onClick={() => handleDelete(c._id)}
                                       className="p-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                       title="Purge Protocol"
                                    >
                                       <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    </button>
                                 </div>
                              </div>
                           </div>
                           {c.expiryDate && (
                              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/5 flex items-center gap-2">
                                 <Clock className="w-3 h-3 text-slate-600" />
                                 <span className="text-[8px] md:text-[9px] font-bold text-slate-500 uppercase tracking-widest italic">Protocol Lock: {new Date(c.expiryDate).toLocaleDateString()}</span>
                              </div>
                           )}
                      </div>
                   ))}
                </div>
             </div>
          </div>
      </main>
    </div>
  );
}
