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
  UserPlus
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
      <main className="flex-1 overflow-y-auto p-6 pt-24 lg:p-12 lg:pt-12">
          {/* Top Header */}
          <div className="flex justify-between items-center mb-12">
            <div className="space-y-1">
              <h1 className="text-3xl font-black uppercase tracking-tighter">Support Inquiries</h1>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Customer Voice Portal • Feedback & Requests</p>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="text-right">
                  <div className="text-[10px] font-black uppercase tracking-widest text-white">{user.name}</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-blue-500">ADMIN CONTROL</div>
               </div>
               <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center">
                  <span className="font-black text-xs text-white">{user.name.charAt(0)}</span>
               </div>
            </div>
          </div>

          {/* Filters Area */}
          <div className="flex flex-wrap gap-4 mb-8">
             <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                   type="text" 
                   placeholder="SEARCH BY NAME OR EMAIL..."
                   className="w-full bg-slate-900 border border-slate-800 pl-12 pr-4 py-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-[#ffc800] transition-colors"
                />
             </div>
             <button className="bg-slate-900 border border-slate-800 px-6 py-3 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:border-slate-600 transition-all">
                <Filter className="w-4 h-4 text-slate-500" />
                Status: All Inquiries
             </button>
          </div>

          {/* Inquiries Table / List */}
          <div className="bg-[#0f172a] border border-slate-800 overflow-x-auto">
            <div className="min-w-[800px]">
             <div className="grid grid-cols-6 p-6 border-b border-slate-800 bg-slate-900/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                <div className="col-span-2">Customer Details</div>
                <div className="col-span-1">Topic</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2 text-right">Interactions</div>
             </div>

             <div className="divide-y divide-slate-800">
                {loading ? (
                  <div className="p-20 text-center text-slate-700 font-black uppercase tracking-[0.5em] text-[10px]">
                     Connecting to Encrypted Stream...
                  </div>
                ) : inquiries.length === 0 ? (
                  <div className="p-20 text-center text-slate-700 font-black uppercase tracking-[0.5em] text-[10px]">
                     Zero Inbox • All Inquiries Resolved
                  </div>
                ) : (
                  inquiries.map((inquiry) => (
                    <div key={inquiry._id} className="grid grid-cols-6 p-8 items-center hover:bg-white/5 transition-colors group">
                       <div className="col-span-2 space-y-1">
                          <div className="text-sm font-black uppercase tracking-tight text-white group-hover:text-[#ffc800] transition-colors">{inquiry.name}</div>
                          <div className="text-[10px] font-bold text-slate-500 lowercase">{inquiry.email}</div>
                       </div>
                       <div className="col-span-1">
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-300">{inquiry.subject}</div>
                       </div>
                       <div className="col-span-1">
                          <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full ${
                             inquiry.status === 'RESOLVED' ? 'bg-green-500/10 text-green-500' :
                             inquiry.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-500' :
                             'bg-yellow-500/10 text-yellow-500'
                          }`}>
                             {inquiry.status}
                          </span>
                       </div>
                       <div className="col-span-2 flex justify-end gap-3 opacity-60 md:opacity-100 lg:opacity-60 lg:group-hover:opacity-100 transition-opacity">
                          <button 
                             onClick={() => alert(`Message: ${inquiry.message}`)}
                             className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all"
                          >
                             <Search className="w-4 h-4" />
                          </button>
                          {inquiry.status !== 'RESOLVED' && (
                             <button 
                                onClick={() => handleUpdateStatus(inquiry._id, 'RESOLVED')}
                                className="p-3 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-black rounded-lg transition-all"
                             >
                                <CheckCircle2 className="w-4 h-4" />
                             </button>
                          )}
                          <button className="p-3 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-black rounded-lg transition-all">
                             <ExternalLink className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                  ))
                )}
             </div>
            </div>
          </div>
      </main>
    </div>
  );
}
