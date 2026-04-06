"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Bike, 
  Calendar, 
  BarChart3, 
  Settings, 
  LogOut, 
  ChevronRight, 
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  UserPlus,
  Loader2,
  PieChart as PieChartIcon,
  Activity,
  ShieldCheck as ShieldIcon,
  FileText,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import BookingDetailModal from "@/components/BookingDetailModal";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from "recharts";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [bikes, setBikes] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
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
    fetchAllData();
  }, [router]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, bikesRes, inquiriesRes] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/bikes"),
        fetch("/api/admin/inquiries")
      ]);

      if (bookingsRes.ok) setBookings(await bookingsRes.json());
      if (bikesRes.ok) setBikes(await bikesRes.json());
      if (inquiriesRes.ok) setInquiries(await inquiriesRes.json());
      
    } catch (err) {
      console.error("Failed to sync dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalRevenue = () => {
    return bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  };

  const revenueData = useMemo(() => {
    const groupedData: Record<string, number> = {};
    bookings.forEach(b => {
      const date = new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      groupedData[date] = (groupedData[date] || 0) + b.totalPrice;
    });
    return Object.entries(groupedData).map(([date, amount]) => ({
      date,
      revenue: amount
    })).reverse();
  }, [bookings]);

  const bikeDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach(b => {
      const name = b.bike?.name || "Unknown";
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value
    }));
  }, [bookings]);

  const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6'];

  if (!user) return null;

  const pendingInquiries = inquiries.filter(i => i.status === "PENDING").length;
  const availableBikes = bikes.filter(b => b.status === "AVAILABLE").length;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col lg:flex-row overflow-hidden font-sansSelection">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-5 md:p-10 pt-24 lg:p-12 lg:pt-12">
          {/* Top Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
                 OPERATIONS <span className="text-[#ffc800]">CONSOLE</span>
              </h1>
              <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <div className="w-1 h-1 bg-[#ffc800] rounded-full animate-pulse"></div>
                 Global Intelligence Overview • {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 p-3 px-4 border border-white/5 w-full md:w-auto">
               <div className="text-right flex-1 md:flex-none">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#ffc800]">{user.name}</div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-blue-500">{user.role} PRIVILEGE LAYER</div>
               </div>
               <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-800 border border-white/5 flex items-center justify-center -skew-x-6">
                  <span className="font-black text-xs text-white skew-x-6">{user.name.charAt(0)}</span>
               </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: "Bookings Synced", val: bookings.length.toString(), trend: "+12.5%", icon: Calendar, color: "text-blue-500" },
              { label: "Revenue Manifest", val: `₹${calculateTotalRevenue().toLocaleString()}`, trend: "+24.2%", icon: TrendingUp, color: "text-emerald-500" },
              { label: "Fleet Readiness", val: `${bikes.length}`, trend: `${availableBikes} Available`, icon: Bike, color: "text-[#ffc800]" },
              { label: "Pending Signals", val: pendingInquiries.toString().padStart(2, '0'), trend: "Emergency Response", icon: MessageSquare, color: "text-rose-500" }
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/5 p-6 md:p-8 space-y-4 hover:border-[#ffc800]/40 hover:bg-white/10 transition-all cursor-default relative group overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                    <stat.icon className="w-12 h-12 md:w-16 md:h-16 text-white" />
                 </div>
                 <div className="flex justify-between items-center relative z-10">
                    <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</span>
                    <span className={`text-[8px] md:text-[9px] font-black ${stat.trend.startsWith('+') || stat.trend.includes('Available') ? 'text-emerald-500' : 'text-rose-500'}`}>{stat.trend}</span>
                 </div>
                 <div className="text-3xl md:text-4xl font-black uppercase tracking-tighter relative z-10 text-white italic">{stat.val}</div>
              </div>
            ))}
          </div>

          {/* Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Revenue Trend Chart */}
            <div className="bg-[#050a15] border border-white/5 p-5 md:p-6 shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-blue-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700 pointer-events-none" />
               <div className="flex justify-between items-center mb-10 pb-4 border-b border-white/5 relative z-10">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-blue-500/10 flex items-center justify-center border border-blue-500/20"><Activity className="w-4 h-4 text-blue-500" /></div>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Financial Velocity</h3>
                 </div>
               </div>
               <div className="h-64 mt-4 relative z-10">
                 {revenueData.length > 0 ? (
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={revenueData}>
                       <defs>
                         <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <XAxis dataKey="date" stroke="#475569" fontSize={8} tickLine={false} axisLine={false} />
                       <YAxis stroke="#475569" fontSize={8} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                       <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase' }} />
                       <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={4} />
                     </AreaChart>
                   </ResponsiveContainer>
                 ) : (
                   <div className="h-full flex items-center justify-center text-[9px] font-black uppercase tracking-[0.5em] text-slate-800 italic">Financial Stream Offline</div>
                 )}
               </div>
            </div>

            {/* Vehicle Preference Pie Chart */}
            <div className="bg-[#050a15] border border-white/5 p-5 md:p-6 shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-emerald-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700 pointer-events-none" />
               <div className="flex justify-between items-center mb-10 pb-4 border-b border-white/5 relative z-10">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20"><PieChartIcon className="w-4 h-4 text-emerald-500" /></div>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Machine Allocation</h3>
                 </div>
               </div>
               <div className="h-64 mt-4 relative z-10">
                 {bikeDistribution.length > 0 ? (
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie data={bikeDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                         {bikeDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                       </Pie>
                       <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', fontSize: '9px', fontWeight: '900' }} />
                       <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '7px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                     </PieChart>
                   </ResponsiveContainer>
                 ) : (
                   <div className="h-full flex items-center justify-center text-[9px] font-black uppercase tracking-[0.5em] text-slate-800 italic">Inventory Signals Null</div>
                 )}
               </div>
            </div>
          </div>

          {/* Records Manifest */}
          <div className="bg-[#050a15] border border-white/5 shadow-2xl">
             <div className="p-5 md:p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40">
                <div className="flex items-center gap-4">
                   <div className="w-8 h-8 bg-[#ffc800] flex items-center justify-center -skew-x-12"><FileText className="w-4 h-4 text-black skew-x-12" /></div>
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Operations Overview Manifest</h3>
                </div>
                <div className="flex w-full sm:w-auto gap-3">
                   <button onClick={fetchAllData} className="flex-1 sm:flex-none text-[9px] font-black px-4 py-2 uppercase bg-white/5 border border-white/10 hover:bg-[#ffc800]/10 transition-all">Re-Sync</button>
                   <Link href="/admin/bookings" className="flex-1 sm:flex-none text-[9px] font-black px-5 py-2 uppercase bg-[#ffc800] text-black border border-[#ffc800] hover:bg-white transition-all flex items-center justify-center gap-1.5 focus:scale-95">
                      GLOBALmanifest <ChevronDown className="w-3 h-3 -rotate-90" />
                   </Link>
                </div>
             </div>
             
             <div className="p-0">
                {loading ? (
                   <div className="h-80 flex flex-col items-center justify-center gap-4 animate-pulse">
                      <Loader2 className="w-8 h-8 text-slate-700 animate-spin" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-800 italic">Retrieving Global Matrix...</span>
                   </div>
                ) : (
                   <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[900px]">
                         <thead>
                            <tr className="bg-black/60 text-slate-600 text-[8px] font-black uppercase tracking-[0.3em] border-b border-white/5">
                               <th className="py-5 px-8">Rider / Auth-ID</th>
                               <th className="py-5 px-8">Unit Assigned</th>
                               <th className="py-5 px-8">Timeline</th>
                               <th className="py-5 px-8">Revenue Yield</th>
                               <th className="py-5 px-8 text-right pr-12">Manifest Access</th>
                            </tr>
                         </thead>
                         <tbody className="text-[10px] font-black uppercase tracking-[0.1em]">
                            {bookings.slice(0, 10).map((b, i) => (
                               <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03] transition-all group">
                                  <td className="py-5 px-8">
                                     <div className="flex flex-col">
                                        <span className="text-white group-hover:text-[#ffc800] transition-colors uppercase italic font-bold tracking-tight">{b.user?.name}</span>
                                        <span className="text-[7px] text-slate-600 font-mono mt-1 italic">MANIFEST_{b.bookingId}</span>
                                     </div>
                                  </td>
                                  <td className="py-5 px-8 italic text-slate-400 font-bold">{b.bike?.name}</td>
                                  <td className="py-5 px-8 text-slate-500 font-black italic">{b.pickupDate}</td>
                                  <td className="py-5 px-8 text-[#ffc800] italic font-black uppercase">₹{b.totalPrice?.toLocaleString()}</td>
                                  <td className="py-5 px-8 text-right pr-12">
                                     <button onClick={() => { setSelectedBooking(b); setIsDetailModalOpen(true); }} className="px-5 py-2.5 bg-white/5 border border-white/5 text-[8px] font-black uppercase hover:bg-white hover:text-black transition-all">VIEW FULL DETAILS</button>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                      {bookings.length > 10 && (
                         <div className="p-6 text-center border-t border-white/5">
                            <Link href="/admin/bookings" className="text-[9px] font-black uppercase text-[#ffc800] hover:text-white transition-all italic tracking-widest">+ Access All {bookings.length} Transactional Records</Link>
                         </div>
                      )}
                   </div>
                )}
             </div>
          </div>
      </main>

      <BookingDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} booking={selectedBooking} />
    </div>
  );
}
