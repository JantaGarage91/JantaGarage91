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
  RefreshCw
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
      <main className="flex-1 overflow-y-auto p-6 pt-24 lg:p-12 lg:pt-12">
          {/* Top Header */}
          <div className="flex justify-between items-center mb-12">
            <div className="space-y-1">
              <h1 className="text-3xl font-black uppercase tracking-tighter italic">COUPON <span className="text-[#ffc800]">REWARDS</span> SYSTEM</h1>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Promotional Protocol • Configure Reward Tokens</p>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="text-right">
                  <div className="text-[10px] font-black uppercase tracking-widest text-white">{user.name}</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-emerald-500">ADMIN CONTROL</div>
               </div>
               <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center">
                  <span className="font-black text-xs text-white">{user.name.charAt(0)}</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
             {/* Form Section */}
             <div className="bg-[#0f172a] border border-slate-800 flex flex-col p-8 h-fit sticky top-0 shadow-2xl">
                <div className="flex justify-between items-start mb-8 pb-4 border-b border-slate-800">
                   <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ffc800]">
                         Configure New Reward Token
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
                              className="w-full bg-[#020617] border border-slate-800 pl-11 pr-4 py-4 text-sm font-black focus:outline-none focus:border-[#ffc800] transition-colors" 
                            />
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Discount (Percentage %)</label>
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
                                    className="w-full bg-[#020617] border border-slate-800 pl-11 pr-4 py-4 text-sm font-black focus:outline-none focus:border-emerald-500 transition-colors" 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Expiry Date (Optional)</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                <input 
                                    type="date" 
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                                    className="w-full bg-[#020617] border border-slate-800 pl-11 pr-4 py-4 text-sm font-black focus:outline-none focus:border-slate-600 transition-colors cursor-pointer" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        {status && <div className={`mb-4 text-[10px] font-black uppercase tracking-widest ${status.includes('❌') ? 'text-red-500' : 'text-emerald-500'}`}>{status}</div>}
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-[#ffc800] hover:bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] py-5 shadow-lg shadow-[#ffc800]/20 transition-all flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            {isSubmitting ? "ENCRYPTING PROTOCOL..." : "PROVISION TOKEN"}
                        </button>
                    </div>
                </form>

                <div className="mt-10 p-6 bg-slate-900/50 border border-slate-800 rounded-none relative overflow-hidden">
                   <div className="relative z-10">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Protocol Note:</div>
                      <p className="text-[9px] font-bold text-slate-600 uppercase leading-relaxed tracking-wider">
                         All generated reward tokens are globally active across the Elite Machine Network once provisioned. Manual status override is available via the Inventory below.
                      </p>
                   </div>
                   <Gift className="absolute -bottom-4 -right-4 w-16 h-16 text-white/5 rotate-12" />
                </div>
             </div>

             {/* List Section */}
             <div className="space-y-6">
                <div className="flex justify-between items-center bg-[#0f172a] border border-slate-800 p-5">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-white italic">Active Protocols</h3>
                   <span className="text-[9px] font-black uppercase text-[#ffc800] border border-[#ffc800]/50 px-4 py-1.5">{coupons.length} REWARD TOKENS</span>
                </div>

                <div className="bg-[#0f172a] border border-slate-800 divide-y divide-slate-800 shadow-xl overflow-hidden">
                   {loading ? (
                       <div className="p-16 text-center">
                          <Loader2 className="w-10 h-10 text-[#ffc800] mx-auto animate-spin mb-4" />
                          <span className="text-[10px] font-black uppercase text-slate-700 tracking-[0.5em]">Synchronizing Registry...</span>
                       </div>
                   ) : coupons.length === 0 ? (
                       <div className="p-16 text-center flex flex-col items-center gap-6">
                           <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center">
                              <Gift className="w-8 h-8 text-slate-800" />
                           </div>
                           <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">No active protocols detected. Provision one to begin.</span>
                       </div>
                   ) : coupons.map((c) => (
                      <div key={c._id} className="p-8 hover:bg-white/[0.02] transition-all group border-l-4 border-transparent hover:border-[#ffc800]">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-10">
                                 <div>
                                    <div className="text-[10px] font-black text-[#ffc800] uppercase tracking-[0.4em] mb-1">PROMO CODE</div>
                                    <div className="text-2xl font-black tracking-tighter text-white italic uppercase group-hover:scale-105 transition-transform origin-left">{c.code}</div>
                                 </div>
                                 <div className="h-10 w-px bg-slate-800"></div>
                                 <div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">DISCOUNT</div>
                                    <div className="text-2xl font-black text-emerald-500 italic tracking-tighter">{c.discountPercent}%</div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4">
                                 <div className="text-right flex flex-col items-end gap-2">
                                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 font-sans">PROTOCOL STATUS</div>
                                    <div className="flex items-center gap-4">
                                       <button 
                                          onClick={() => toggleStatus(c._id, c.isActive)}
                                          className={`relative w-14 h-7 rounded-full transition-all duration-500 border-2 ${
                                             c.isActive ? 'bg-emerald-500 border-emerald-400' : 'bg-slate-800 border-slate-700'
                                          }`}
                                       >
                                          <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-all duration-500 shadow-lg ${
                                             c.isActive ? 'left-8 shadow-emerald-900/50' : 'left-1'
                                          }`}></div>
                                          <span className={`absolute top-1/2 -translate-y-1/2 text-[8px] font-black uppercase tracking-tighter transition-all duration-500 ${
                                             c.isActive ? 'left-2 text-white' : 'right-2 text-slate-500'
                                          }`}>
                                             {c.isActive ? 'ON' : 'OFF'}
                                          </span>
                                       </button>
                                       <button 
                                          onClick={() => handleDelete(c._id)}
                                          className="p-2.5 bg-slate-800 text-slate-500 hover:bg-red-600 hover:text-white transition-all border border-slate-700 hover:border-red-500"
                                          title="Purge Protocol"
                                       >
                                          <Trash2 className="w-4 h-4" />
                                       </button>
                                    </div>
                                    <span className={`text-[8px] font-black px-3 py-1 rounded-none mt-1 border ${
                                       c.isActive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30 font-sans'
                                    }`}>
                                       {c.isActive ? 'OPERATIONAL' : 'DEACTIVATED'}
                                    </span>
                                 </div>
                              </div>
                           </div>
                           {c.expiryDate && (
                              <div className="mt-6 pt-6 border-t border-slate-800 flex items-center gap-2">
                                 <Clock className="w-3 h-3 text-slate-600" />
                                 <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Protocol expiration: {new Date(c.expiryDate).toLocaleDateString()}</span>
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
