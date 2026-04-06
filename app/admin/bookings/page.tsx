"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  Search, 
  Filter, 
  ArrowLeft, 
  Download, 
  Calendar, 
  Bike, 
  User, 
  ChevronRight,
  ShieldCheck,
  Loader2,
  Trash2,
  ChevronDown,
  History,
  PlayCircle,
  FastForward
} from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import BookingDetailModal from "@/components/BookingDetailModal";
import * as XLSX from 'xlsx';

export default function BookingInventory() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionFilter, setSessionFilter] = useState("ALL");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
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
    fetchBookings();
  }, [router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/bookings");
      if (res.ok) {
        setBookings(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, bookingId: string) => {
    if (!confirm(`CRITICAL: Are you sure you want to permanently erase record ${bookingId}?`)) return;

    try {
      setIsDeleting(id);
      const res = await fetch(`/api/bookings?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setBookings(prev => prev.filter(b => b._id !== id));
      }
    } catch (err) {
      alert("SYSTEM FAILURE: Targeted record is currently locked.");
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredBookings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bookings.filter(b => {
      // Basic Search Filter
      const matchesSearch = 
        b.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.bike?.name?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Session Status Logic
      const pickup = new Date(b.pickupDate);
      const dropoff = new Date(b.dropoffDate);
      pickup.setHours(0, 0, 0, 0);
      dropoff.setHours(0, 0, 0, 0);

      const isExpired = dropoff < today;
      const isFuture = pickup > today;
      const isActive = !isExpired && !isFuture;

      if (sessionFilter === "EXPIRED") return isExpired;
      if (sessionFilter === "ACTIVE") return isActive;
      if (sessionFilter === "FUTURE") return isFuture;

      return true;
    });
  }, [bookings, searchQuery, sessionFilter]);

  const exportToExcel = () => {
    if (filteredBookings.length === 0) return;
    const dataToExport = filteredBookings.map(b => ({
      'ID': b.bookingId,
      'Rider': b.user?.name || 'N/A',
      'Vehicle': b.bike?.name || 'N/A',
      'Pickup': b.pickupDate,
      'Dropoff': b.dropoffDate,
      'Revenue': b.totalPrice,
      'System Ref': b._id
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Manifest");
    XLSX.writeFile(workbook, `HIMALAYAN_RIDER_EXPORT_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col lg:flex-row overflow-hidden font-sansSelection">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 pt-24 lg:p-12 lg:pt-12">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">GLOBAL <span className="text-[#ffc800]">INVENTORY</span></h1>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#ffc800] rounded-full animate-pulse"></div>
              Live Monitoring System Active
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
             {/* Complex Search Group */}
             <div className="flex w-full sm:w-auto bg-white/5 border border-white/10 p-1">
                <div className="relative flex-1 sm:w-64">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                   <input 
                     type="text" 
                     placeholder="ID / RIDER / MACHINE"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full bg-transparent border-none px-12 py-3 text-[10px] font-black uppercase tracking-widest text-[#ffc800] placeholder:text-slate-600 focus:outline-none focus:ring-0"
                   />
                </div>
                {/* Session Filter Dropdown */}
                <select 
                  value={sessionFilter}
                  onChange={(e) => setSessionFilter(e.target.value)}
                  className="bg-black/40 border-l border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300 px-6 py-3 focus:outline-none appearance-none hover:text-[#ffc800] transition-colors cursor-pointer"
                >
                   <option value="ALL">All Sessions</option>
                   <option value="ACTIVE">⚡ Active Now</option>
                   <option value="EXPIRED">⏳ Expiry Session</option>
                   <option value="FUTURE">🚀 Future Session</option>
                </select>
             </div>

             <button 
                onClick={exportToExcel}
                className="w-full sm:w-auto bg-[#ffc800] text-black border border-[#ffc800] px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:border-white transition-all flex items-center justify-center gap-2 active:scale-95"
             >
                <Download className="w-4 h-4" /> EXPORT EXCEL
             </button>
          </div>
        </div>

        {/* Inventory Body */}
        <div className="bg-[#050a15] border border-white/5 relative">
          <div className="p-6 border-b border-white/5 flex justify-between items-center relative z-10 bg-slate-950/20">
             <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-[#ffc800] flex items-center justify-center -skew-x-12">
                   <FileText className="w-4 h-4 text-black skew-x-12" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Overview Manifest • <span className={sessionFilter === 'ALL' ? 'text-slate-500' : 'text-[#ffc800]'}>{sessionFilter} FILTER ENABLED</span></h3>
             </div>
             <button onClick={fetchBookings} className="text-[9px] font-black uppercase text-slate-500 hover:text-white transition-colors border border-white/5 px-3 py-1.5 flex items-center gap-2">RE-SYNC Records <Loader2 className="w-3 h-3" /></button>
          </div>

          <div className="p-0 relative z-10">
             {loading ? (
                <div className="h-96 flex items-center justify-center text-slate-500 uppercase font-black text-[10px] tracking-widest italic animate-pulse">Retrieving Operational Data Matrix...</div>
             ) : (
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse min-w-[1100px]">
                      <thead>
                        <tr className="bg-black/40 text-slate-500 text-[8px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                          <th className="py-5 px-8">Sequence ID</th>
                          <th className="py-5 px-8">Verified Rider</th>
                          <th className="py-5 px-8">Session Timeline</th>
                          <th className="py-5 px-8">Assigned Fleet</th>
                          <th className="py-5 px-8">Transaction Value</th>
                          <th className="py-5 px-8 text-right pr-12">Action Control</th>
                        </tr>
                      </thead>
                      <tbody className="text-[10px] font-black uppercase tracking-[0.1em]">
                        {filteredBookings.map((b, i) => {
                          const pickup = new Date(b.pickupDate);
                          const dropoff = new Date(b.dropoffDate);
                          const today = new Date();
                          today.setHours(0,0,0,0);
                          pickup.setHours(0,0,0,0);
                          dropoff.setHours(0,0,0,0);

                          let badge;
                          if (dropoff < today) badge = { text: "EXPIRED", color: "bg-slate-800 text-slate-500", icon: History };
                          else if (pickup > today) badge = { text: "FUTURE", color: "bg-blue-500/10 text-blue-500", icon: FastForward };
                          else badge = { text: "ACTIVE", color: "bg-emerald-500/10 text-emerald-500", icon: PlayCircle };

                          return (
                            <tr key={i} className={`border-b border-white/5 hover:bg-white/5 transition-all group ${isDeleting === b._id ? 'opacity-30' : ''}`}>
                              <td className="py-6 px-8">
                                 <div className="text-white group-hover:text-[#ffc800] transition-colors">{b.bookingId}</div>
                                 <div className="text-[7px] text-slate-600 font-mono mt-1 italic uppercase">REF: {b._id?.slice(-8)}</div>
                              </td>
                              <td className="py-6 px-8">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-900 border border-white/10 flex items-center justify-center text-[#ffc800] text-[10px] italic">{b.user?.name?.charAt(0)}</div>
                                    <div className="text-white truncate max-w-[150px]">{b.user?.name}</div>
                                 </div>
                              </td>
                              <td className="py-6 px-8">
                                 <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                       <badge.icon className={`w-3 h-3 ${badge.color.split(' ')[1]}`} />
                                       <span className={`${badge.color} px-2 py-0.5 rounded-none text-[7px] font-black`}>{badge.text}</span>
                                    </div>
                                    <div className="text-slate-400 font-bold">{b.pickupDate} <span className="text-slate-600 px-1 italic">›</span> {b.dropoffDate}</div>
                                 </div>
                              </td>
                              <td className="py-6 px-8 italic text-slate-400">{b.bike?.name}</td>
                              <td className="py-6 px-8 text-[#ffc800] italic font-black">₹{b.totalPrice?.toLocaleString()}</td>
                              <td className="py-6 px-8 text-right pr-12 space-x-3">
                                 <button onClick={() => { setSelectedBooking(b); setIsDetailModalOpen(true); }} className="bg-white text-black px-5 py-2.5 text-[8px] font-black uppercase tracking-widest hover:bg-[#ffc800] transition-all shadow-[0_5px_15px_rgba(0,0,0,0.3)]">VIEW MANIFEST</button>
                                 <button onClick={() => handleDelete(b._id, b.bookingId)} className="bg-rose-500/10 text-rose-500 border border-rose-500/20 p-2.5 hover:bg-rose-500 hover:text-white transition-all">{isDeleting === b._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}</button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                   </table>
                </div>
             )}
          </div>
        </div>
      </main>

      <BookingDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} booking={selectedBooking} />
    </div>
  );
}
