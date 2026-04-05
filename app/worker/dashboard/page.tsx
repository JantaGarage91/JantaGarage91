"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Bike, 
  Calendar, 
  LogOut, 
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Settings
} from "lucide-react";

export default function WorkerDashboard() {
  const [worker, setWorker] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [bikes, setBikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"HUB" | "INVENTORY">("HUB");
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/worker");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "WORKER") {
      router.push("/");
      return;
    }
    setWorker(parsedUser);
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [bookingsRes, bikesRes] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/bikes")
      ]);
      
      if (!bookingsRes.ok || !bikesRes.ok) {
        throw new Error("SECURE STREAM CONNECTION FAILED");
      }
      
      const [bookingData, bikeData] = await Promise.all([
        bookingsRes.json(),
        bikesRes.json()
      ]);
      
      setBookings(bookingData.slice(0, 5));
      setBikes(bikeData);
    } catch (err: any) {
      setError(err.message || "OPERATIONAL SYNC FAILURE");
    } finally {
      setLoading(false);
    }
  };

  const toggleBikeStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/bikes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus })
      });
      if (res.ok) {
        setBikes(prev => prev.map(b => b._id === id ? { ...b, isActive: !currentStatus } : b));
      } else {
        throw new Error("DEPLOYMENT COMMAND FAILED");
      }
    } catch (err: any) {
      setError(err.message || "FLEET OVERRIDE ERROR");
    }
  };

  if (!worker) return null;

  const availableBikes = bikes.filter(b => b.status === "AVAILABLE" && b.isActive);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex overflow-hidden font-sansSelection">
      {/* Sidebar */}
      <aside className="w-64 bg-[#050a15] border-r border-emerald-500/10 flex flex-col hidden lg:flex">
         <div className="p-8 border-b border-emerald-500/10 flex items-center justify-center">
            <div className="flex items-center gap-3 bg-[#1e293b] p-2 -skew-x-12 border border-white/5">
                <div className="skew-x-12 w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
                    <Wrench className="w-3 h-3 text-black" />
                </div>
                <span className="skew-x-12 text-xs font-black italic tracking-tighter uppercase text-white">
                    STAFF<span className="text-emerald-500">PRO</span>
                </span>
            </div>
         </div>
         
         <nav className="flex-1 p-6 space-y-2">
            {[
              { id: "HUB", icon: Wrench, label: "Maintenance Hub" },
              { id: "INVENTORY", icon: Settings, label: "Master Inventory" }
            ].map((item) => (
              <button 
                key={item.id} 
                onClick={() => setActiveView(item.id as any)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeView === item.id ? "bg-emerald-500 text-black translate-x-1 shadow-[0_0_20px_rgba(16,185,129,0.2)]" : "text-slate-500 hover:text-white"
                }`}
              >
                <item.icon className={`w-4 h-4 ${activeView === item.id ? 'text-black' : 'text-emerald-500/50'}`} />
                {item.label}
              </button>
            ))}
         </nav>

         <div className="p-6 border-t border-emerald-500/10">
            <button 
              onClick={() => {
                localStorage.removeItem("user");
                router.push("/worker");
              }}
              className="w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Kill Session
            </button>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12">
         {/* Error Context Board */}
         {error && (
            <div className="mb-10 p-6 bg-red-500/10 border-2 border-red-500/20 flex items-center justify-between text-red-500 rounded-none animate-in fade-in slide-in-from-top-4">
               <div className="flex items-center gap-4">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                  <div>
                     <div className="text-[10px] font-black uppercase tracking-[0.3em] overflow-hidden">Critical Error Matrix</div>
                     <div className="text-[9px] font-black uppercase opacity-60 tracking-widest mt-1">Status: {error}</div>
                  </div>
               </div>
               <button 
                  onClick={loadDashboardData}
                  className="px-6 py-2 bg-red-500 text-black text-[9px] font-black uppercase tracking-widest hover:bg-white transition-colors"
               >
                  Retry Override
               </button>
            </div>
         )}
         
         {/* Top Header */}
         <div className="flex justify-between items-center mb-12">
            <div className="space-y-1">
              <h1 className="text-3xl font-black uppercase tracking-tighter italic">
                {activeView === "HUB" ? "STAFF " : "FLEET "}
                <span className="text-emerald-500">{activeView === "HUB" ? "REGISTRY" : "INVENTORY"}</span>
              </h1>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                Access: WORKER_{worker.workerId} • View: {activeView}
              </p>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="text-right">
                  <div className="text-[10px] font-black uppercase tracking-widest text-white">{worker.name}</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-emerald-500">OPERATIONAL STATUS: READY</div>
               </div>
               <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-emerald-500" />
               </div>
            </div>
         </div>

         {activeView === "HUB" ? (
           <>
             {/* Maintenance Grid */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[
                  { label: "Ready Machines", val: availableBikes.length.toString().padStart(2, '0'), icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/5" },
                  { label: "Active Deployments", val: bookings.length.toString().padStart(2, '0'), icon: Bike, color: "text-blue-500", bg: "bg-blue-500/5" },
                  { label: "System Alerts", val: "03", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/5" },
                ].map((stat, i) => (
                  <div key={i} className={`${stat.bg} border border-white/5 p-8 space-y-4 hover:border-emerald-500/30 transition-all cursor-default relative group overflow-hidden`}>
                     <div className="flex justify-between items-center relative z-10">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.25em]">{stat.label}</span>
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                     </div>
                     <div className="text-4xl font-black uppercase tracking-tighter relative z-10">{stat.val}</div>
                     <div className="w-full h-1 bg-white/5 mt-4">
                        <div className="w-2/3 h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                     </div>
                  </div>
                ))}
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Real-time Bookings */}
                <div className="bg-[#050a15] border border-emerald-500/10 h-fit">
                   <div className="p-5 border-b border-emerald-500/10 flex justify-between items-center">
                      <h3 className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Live Deployments</h3>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   </div>
                   <div className="p-6">
                      <div className="space-y-3">
                         {loading ? (
                            <div className="p-8 text-center text-slate-500 animate-pulse uppercase font-black text-[9px] tracking-widest">Scanning Stream...</div>
                         ) : bookings.length === 0 ? (
                            <div className="p-8 text-center text-slate-700 uppercase font-black text-[9px] tracking-widest border border-dashed border-white/5">No Active Bookings</div>
                         ) : bookings.map((job, i) => (
                            <div key={i} className="group bg-white/5 p-4 border border-transparent hover:border-emerald-500/20 transition-all flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 bg-slate-900 border border-white/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black">
                                     <Bike className="w-3.5 h-3.5" />
                                  </div>
                                  <div>
                                     <h4 className="text-[11px] font-black uppercase">{job.bike?.name}</h4>
                                     <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{job.user?.name}</p>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <div className="text-[10px] font-black text-emerald-500/60 font-mono tracking-tighter">#{job.bookingId.slice(-4)}</div>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Fleet Availability */}
                <div className="bg-[#050a15] border border-emerald-500/10 h-fit">
                   <div className="p-5 border-b border-emerald-500/10 flex justify-between items-center">
                      <h3 className="text-[9px] font-black uppercase tracking-widest text-[#ffc800]">Available Fleet</h3>
                      <button onClick={loadDashboardData} className="text-[8px] font-black uppercase text-slate-500 hover:text-white transition-colors">Refresh Engine</button>
                   </div>
                   <div className="p-6">
                      <div className="space-y-3">
                         {loading ? (
                            <div className="p-8 text-center text-slate-500 animate-pulse uppercase font-black text-[9px] tracking-widest">Querying Hangar...</div>
                         ) : availableBikes.length === 0 ? (
                            <div className="p-8 text-center text-slate-700 uppercase font-black text-[9px] tracking-widest border border-dashed border-white/5">All Units Deployed</div>
                         ) : availableBikes.map((bike, i) => (
                            <div key={i} className="group bg-white/5 p-4 border border-transparent hover:border-[#ffc800]/20 transition-all flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 bg-slate-900 border border-white/10 flex items-center justify-center text-[#ffc800] group-hover:bg-[#ffc800] group-hover:text-black">
                                     <CheckCircle2 className="w-3.5 h-3.5" />
                                  </div>
                                  <div>
                                     <h4 className="text-[11px] font-black uppercase">{bike.name}</h4>
                                     <p className="text-[8px] font-bold text-emerald-500/70 uppercase tracking-widest mt-0.5">{bike.category}</p>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <div className="text-[10px] font-black text-white italic tracking-tighter">₹{bike.pricePerDay}/D</div>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
           </>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {bikes.map((bike, i) => (
               <div key={i} className={`bg-[#050a15] border ${bike.isActive ? 'border-white/5' : 'border-red-500/30'} p-6 hover:border-emerald-500/30 transition-all group relative overflow-hidden`}>
                 <div className="absolute top-0 right-0 p-4">
                    <div className={`w-2 h-2 rounded-full ${bike.status === 'AVAILABLE' && bike.isActive ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500'} animate-pulse`}></div>
                 </div>
                 <div className="flex items-center gap-6 mb-6">
                    <div className={`w-16 h-16 bg-slate-900 border border-white/10 flex items-center justify-center ${bike.isActive ? 'group-hover:bg-emerald-500' : 'group-hover:bg-red-500'} group-hover:text-black transition-all`}>
                       <Bike className="w-8 h-8 opacity-40 group-hover:opacity-100" />
                    </div>
                    <div>
                       <h4 className={`text-[14px] font-black uppercase tracking-tight italic ${!bike.isActive && 'text-red-500/50 line-through'}`}>{bike.name}</h4>
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{bike.category}</p>
                    </div>
                 </div>
                 <div className="space-y-3 pt-4 border-t border-white/5 mb-6">
                    <div className="flex justify-between items-center text-[10px]">
                       <span className="font-black text-slate-600 uppercase tracking-widest">Rate</span>
                       <span className="font-black text-white italic">₹{bike.pricePerDay}/Day</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                       <span className="font-black text-slate-600 uppercase tracking-widest">Reg ID</span>
                       <span className="font-black text-slate-400 font-mono italic">{bike.vehicleNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                       <span className="font-black text-slate-600 uppercase tracking-widest">Visibility</span>
                       <span className={`font-black ${bike.isActive ? 'text-emerald-500' : 'text-red-500'} uppercase tracking-widest`}>{bike.isActive ? 'Active' : 'Dark'}</span>
                    </div>
                 </div>
                 
                 <button 
                  onClick={() => toggleBikeStatus(bike._id, bike.isActive)}
                  className={`w-full py-3 text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
                    bike.isActive 
                      ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' 
                      : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                  }`}
                 >
                  {bike.isActive ? 'Deactivate Unit' : 'Activate Unit'}
                 </button>

                 <div className={`absolute bottom-0 left-0 w-full h-1 bg-white/5 ${bike.isActive ? 'group-hover:bg-emerald-500' : 'group-hover:bg-red-500'} transition-all`}></div>
               </div>
             ))}
           </div>
         )}
      </main>
    </div>
  );
}
