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
  Activity
} from "lucide-react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
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

  // Prepare chart data
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
    <div className="min-h-screen bg-[#020617] text-slate-100 flex overflow-hidden">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12">
         {/* Top Header */}
         <div className="flex justify-between items-center mb-12">
            <div className="space-y-1">
              <h1 className="text-3xl font-black uppercase tracking-tighter">OPERATIONS CONSOLE</h1>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Overview • {new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="text-right">
                  <div className="text-[10px] font-black uppercase tracking-widest text-white">{user.name}</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-blue-500">{user.role} PRIVILEGE</div>
               </div>
               <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center">
                  <span className="font-black text-xs text-white">{user.name.charAt(0)}</span>
               </div>
            </div>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              { label: "Bookings Processed", val: bookings.length.toString(), trend: "+12.5%", icon: Calendar, color: "text-blue-500" },
              { label: "Total Revenue", val: `₹${calculateTotalRevenue().toLocaleString()}`, trend: "+24.2%", icon: TrendingUp, color: "text-green-500" },
              { label: "Fleet Inventory", val: `${bikes.length}`, trend: `${availableBikes} Available`, icon: Bike, color: "text-indigo-500" },
              { label: "Open Inquiries", val: pendingInquiries.toString().padStart(2, '0'), trend: "Needs Action", icon: MessageSquare, color: "text-red-500" }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 space-y-4 hover:border-blue-500/50 transition-all cursor-default relative group overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity">
                    <stat.icon className="w-16 h-16" />
                 </div>
                 <div className="flex justify-between items-center relative z-10">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.25em]">{stat.label}</span>
                    <span className={`text-[9px] font-black ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{stat.trend}</span>
                 </div>
                 <div className="text-4xl font-black uppercase tracking-tighter relative z-10">{stat.val}</div>
              </div>
            ))}
         </div>

         {/* Visualizations */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Revenue Trend Chart */}
            <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-none">
              <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Revenue Velocity</h3>
                </div>
              </div>
              <div className="h-64 mt-4">
                {revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#475569" 
                        fontSize={8} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#475569" 
                        fontSize={8} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', fontSize: '10px', color: '#f1f5f9' }}
                        itemStyle={{ color: '#3b82f6' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-[10px] font-black uppercase tracking-[0.5em] text-slate-700">
                    No Revenue Data Stream
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle Preference Pie Chart */}
            <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-none">
              <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Fleet Distribution</h3>
                </div>
              </div>
              <div className="h-64 mt-4">
                {bikeDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bikeDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {bikeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                         contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', fontSize: '10px' }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        wrapperStyle={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-[10px] font-black uppercase tracking-[0.5em] text-slate-700">
                    No Allocation Records
                  </div>
                )}
              </div>
            </div>
         </div>

         {/* Activity Grid */}
         <div className="grid grid-cols-1 gap-8">
            <div className="bg-[#0f172a] border border-slate-800">
               <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="text-[10px] font-black uppercase tracking-widest">Global Booking Inventory</h3>
                  <button onClick={fetchAllData} className="text-[10px] font-black uppercase text-blue-500 hover:underline">Synchronize Records</button>
               </div>
               <div className="p-8">
                  {loading ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-4">
                       <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Retrieving Secure Data...</span>
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="w-full h-80 border border-dashed border-slate-800 rounded-none flex items-center justify-center text-slate-700 font-black text-[10px] uppercase tracking-[0.5em]">
                       No Transactional Data Found
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                         <thead>
                            <tr className="bg-slate-950/50 text-slate-500 text-[8px] font-black uppercase tracking-[0.2em] border-b border-slate-800">
                               <th className="py-4 px-6">Identity</th>
                               <th className="py-4 px-6">Vehicle</th>
                               <th className="py-4 px-6">Timeline</th>
                               <th className="py-4 px-6 text-right">Revenue</th>
                            </tr>
                         </thead>
                         <tbody className="text-[10px] font-black uppercase tracking-widest transition-colors">
                            {bookings.map((b, i) => (
                               <tr key={i} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors group">
                                  <td className="py-4 px-6">
                                     <div className="flex flex-col">
                                        <span className="text-white group-hover:text-blue-400 transition-colors">{b.user?.name}</span>
                                        <span className="text-[8px] text-slate-600 lowercase tracking-normal mt-1">{b.bookingId}</span>
                                     </div>
                                  </td>
                                  <td className="py-4 px-6 italic text-slate-400">{b.bike?.name}</td>
                                  <td className="py-4 px-6 text-slate-500">{b.pickupDate}</td>
                                  <td className="py-4 px-6 text-right text-[#ffc800]">₹{b.totalPrice}</td>
                                </tr>
                            ))}
                         </tbody>
                      </table>
                    </div>
                  )}
               </div>
            </div>
         </div>
      </main>
    </div>
  );
}
