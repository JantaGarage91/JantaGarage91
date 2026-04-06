"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Bike, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut, 
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  UserPlus,
  Mail,
  ChevronRight,
  Loader2
} from "lucide-react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminInquiries() {
  const [user, setUser] = useState<any>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    fetchInquiries();
  }, [router]);

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/admin/inquiries");
      const data = await res.json();
      if (res.ok) {
        setInquiries(data);
      }
    } catch (err) {
      console.error("Failed to fetch inquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setInquiries(inquiries.map(inq => inq._id === id ? { ...inq, status: newStatus } : inq));
      }
    } catch (err) {
      console.error("Failed to update status");
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
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">SUPPORT <span className="text-[#ffc800]">INQUIRIES</span></h1>
              <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Customer Voice Portal • Feedback & Requests</p>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 p-3 border border-white/5 w-full md:w-auto">
               <div className="text-right flex-1 md:flex-none">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#ffc800]">{user.name}</div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-blue-500">ADMIN CONTROL</div>
               </div>
               <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-800 border border-white/5 flex items-center justify-center -skew-x-6">
                  <span className="font-black text-xs text-white skew-x-6">{user.name.charAt(0)}</span>
               </div>
            </div>
          </div>

          {/* Filters Area */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
             <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                   type="text" 
                   placeholder="SEARCH NAME OR EMAIL..."
                   className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-[#ffc800] transition-all"
                />
             </div>
             <button className="bg-white/5 border border-white/10 px-8 py-4 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#ffc800] hover:text-black transition-all group">
                <Filter className="w-4 h-4 text-slate-500 group-hover:text-black" />
                Filter: All
             </button>
          </div>

          {/* Inquiries Grid */}
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-[#0f172a] border border-white/5 p-5">
               <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-white italic">Inbox manifest</h3>
               <span className="text-[9px] font-black uppercase text-[#ffc800] bg-[#ffc800]/5 px-4 py-1.5 border border-[#ffc800]/20">{inquiries.length} TICKETS</span>
            </div>

            <div className="bg-[#0f172a] border border-white/5 overflow-hidden divide-y divide-white/5 shadow-2xl">
               {loading ? (
                  <div className="p-20 text-center flex flex-col items-center gap-4 opacity-30">
                     <Loader2 className="w-10 h-10 animate-spin" />
                     <span className="text-[9px] font-black uppercase tracking-[0.5em] italic">Synchronizing Stream...</span>
                  </div>
               ) : inquiries.length === 0 ? (
                  <div className="p-20 text-center flex flex-col items-center gap-6 opacity-30">
                     <CheckCircle2 className="w-12 h-12" />
                     <span className="text-[9px] font-black uppercase tracking-[0.3em]">Zero Inbox • No pending inquiries</span>
                  </div>
               ) : (
                  <div className="divide-y divide-white/5">
                    {inquiries.map((inquiry) => (
                      <div key={inquiry._id} className="p-6 md:p-8 hover:bg-white/[0.02] transition-all group border-l-2 border-transparent hover:border-[#ffc800]">
                         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex items-start gap-5">
                               <div className={`w-12 h-12 border flex items-center justify-center shrink-0 -skew-x-6 ${
                                  inquiry.status === 'RESOLVED' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' : 'border-amber-500/20 text-amber-500 bg-amber-500/5'
                               }`}>
                                  <MessageSquare className="w-5 h-5 skew-x-6" />
                               </div>
                               <div className="space-y-2">
                                  <div className="flex flex-wrap items-center gap-3">
                                     <div className="text-sm md:text-base font-black uppercase tracking-tight text-white group-hover:text-[#ffc800] transition-colors">{inquiry.name}</div>
                                     <span className={`px-2 py-0.5 text-[8px] font-black uppercase border ${
                                        inquiry.status === 'RESOLVED' ? 'border-emerald-500/30 text-emerald-500' : 'border-amber-500/30 text-amber-500'
                                     }`}>
                                        {inquiry.status}
                                     </span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                     <span className="text-[9px] font-black text-slate-500 lowercase flex items-center gap-1.5 italic">
                                        <Mail className="w-3 h-3" /> {inquiry.email}
                                     </span>
                                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <ChevronRight className="w-3 h-3 text-[#ffc800]" /> {inquiry.subject}
                                     </span>
                                  </div>
                               </div>
                            </div>
                            <div className="flex items-center justify-between lg:justify-end gap-3 pt-6 lg:pt-0 border-t lg:border-none border-white/5">
                               <div className="lg:hidden text-[8px] font-black text-slate-600 uppercase tracking-widest">Controls</div>
                               <div className="flex items-center gap-3">
                                  <button 
                                     onClick={() => alert(`MESSAGE CONTENT:\n\n${inquiry.message}`)}
                                     className="px-4 py-2.5 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                                  >
                                     Read Message
                                  </button>
                                  {inquiry.status !== 'RESOLVED' && (
                                     <button 
                                        onClick={() => handleUpdateStatus(inquiry._id, 'RESOLVED')}
                                        className="p-2.5 bg-emerald-500 border border-emerald-500 text-black hover:bg-white hover:border-white transition-all shadow-[0_5px_15px_rgba(16,185,129,0.2)]"
                                        title="Mark as Resolved"
                                     >
                                        <CheckCircle2 className="w-4 h-4" />
                                     </button>
                                  )}
                               </div>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
               )}
            </div>
          </div>
      </main>
    </div>
  );
}
