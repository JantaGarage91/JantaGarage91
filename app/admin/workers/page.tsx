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
  UserPlus,
  Search,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Lock,
  Plus,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  X,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminWorkers() {
  const [user, setUser] = useState<any>(null);
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    id: "", // For editing
    workerId: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    password: ""
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
    fetchWorkers();
  }, [router]);

  const fetchWorkers = async () => {
    try {
      const res = await fetch("/api/workers");
      const data = await res.json();
      if (res.ok) setWorkers(data);
    } catch (err) {
      console.error("Failed to fetch workers");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(isEditing ? "Updating Identity..." : "Processing Identity Creation...");
    
    try {
      const method = isEditing ? "PUT" : "POST";
      const body = isEditing ? { ...formData } : formData;

      const res = await fetch("/api/workers", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus(`✅ ${isEditing ? 'Updated' : 'Stored'} Successfully!`);
        resetForm();
        fetchWorkers();
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setStatus("❌ Connection Error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to PERMANENTLY remove this worker?")) return;
    try {
      const res = await fetch(`/api/workers?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchWorkers();
        alert("Worker Removed from Database.");
      }
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const startEdit = (worker: any) => {
    setIsEditing(true);
    setFormData({
      id: worker._id,
      workerId: worker.workerId,
      name: worker.name,
      phone: worker.phone,
      email: worker.email,
      address: worker.address,
      password: worker.passwordHash // Admin can see it since it's raw
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ id: "", workerId: "", name: "", phone: "", email: "", address: "", password: "" });
    setIsEditing(false);
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
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">WORKER <span className="text-[#ffc800]">IDENTITY</span> HUB</h1>
              <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Manage Workforce • Edit/Modify Credentials</p>
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

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
             {/* Form Section */}
             <div className="bg-[#0f172a] border border-white/5 flex flex-col p-6 md:p-8 h-fit lg:sticky lg:top-4 shadow-2xl">
                <div className="flex justify-between items-start mb-8">
                   <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ffc800]">
                         {isEditing ? "Identity Modification" : "Identity Provisioning"}
                      </h3>
                      <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase tracking-wider">
                         {isEditing ? `Modifying profile for ${formData.workerId}` : "Create new encrypted credentials for field workers."}
                      </p>
                   </div>
                   {isEditing && (
                      <button onClick={resetForm} className="p-2 border border-white/10 hover:bg-rose-500 transition-colors">
                         <X className="w-4 h-4" />
                      </button>
                   )}
                </div>

                <form onSubmit={handleCreateOrUpdate} className="space-y-5">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Unique Work ID</label>
                         <div className="relative">
                            <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                            <input 
                               type="text" 
                               placeholder="WRK-100" 
                               required
                               disabled={isEditing}
                               value={formData.workerId}
                               onChange={(e) => setFormData({...formData, workerId: e.target.value})}
                               className="w-full bg-[#020617] border border-white/10 pl-10 pr-4 py-3.5 text-xs font-bold focus:outline-none focus:border-[#ffc800] transition-all disabled:opacity-30" 
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Identity Name</label>
                         <input 
                            type="text" 
                            placeholder="John Doe" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-[#020617] border border-white/10 px-4 py-3.5 text-xs font-bold focus:outline-none focus:border-[#ffc800] transition-all" 
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Phone Line</label>
                         <input 
                            type="text" 
                            placeholder="+91 XXXXX XXXXX" 
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-[#020617] border border-white/10 px-4 py-3.5 text-xs font-bold focus:outline-none focus:border-[#ffc800] transition-all" 
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Internal Email</label>
                         <input 
                            type="email" 
                            placeholder="worker@rentrip.in" 
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-[#020617] border border-white/10 px-4 py-3.5 text-xs font-bold focus:outline-none focus:border-[#ffc800] transition-all" 
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Permanent Residence</label>
                      <textarea 
                         placeholder="Current living address..." 
                         required
                         rows={2}
                         value={formData.address}
                         onChange={(e) => setFormData({...formData, address: e.target.value})}
                         className="w-full bg-[#020617] border border-white/10 px-4 py-3.5 text-xs font-bold focus:outline-none focus:border-[#ffc800] transition-all resize-none" 
                      ></textarea>
                   </div>

                   <div className="space-y-2 pb-4">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Access Password</label>
                      <div className="relative">
                         <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                         <input 
                            type="text" 
                            placeholder="••••••••" 
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full bg-[#020617] border border-white/10 pl-10 pr-4 py-3.5 text-xs font-bold focus:outline-none focus:border-[#ffc800] transition-all" 
                         />
                      </div>
                   </div>

                   {status && (
                     <div className={`text-[9px] font-black uppercase tracking-widest mb-4 ${status.includes('❌') ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {status}
                     </div>
                   )}

                   <button 
                     type="submit" 
                     disabled={isSubmitting}
                     className="w-full bg-[#ffc800] hover:bg-white text-black font-black uppercase tracking-widest text-[10px] py-4.5 transition-all shadow-[0_5px_20px_rgba(255,200,0,0.15)] active:scale-[0.98]"
                   >
                      {isSubmitting ? "SYNCING..." : isEditing ? "Save Modifications" : "Create Identity"}
                   </button>
                </form>
             </div>

             {/* List Section */}
             <div className="space-y-6">
                <div className="flex justify-between items-center bg-[#0f172a] border border-white/5 p-5">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-white italic">Registered Workforce</h3>
                   <span className="text-[9px] font-black uppercase text-[#ffc800] bg-[#ffc800]/5 px-3 py-1 border border-[#ffc800]/10">{workers.length} Members</span>
                </div>

                <div className="bg-[#0f172a] border border-white/5 overflow-hidden divide-y divide-white/5 shadow-xl">
                   {loading ? (
                      <div className="p-16 text-center text-[9px] font-black uppercase text-slate-700 tracking-[0.5em] animate-pulse">Scanning DB Registry...</div>
                   ) : workers.length === 0 ? (
                      <div className="p-16 text-center flex flex-col items-center gap-6 opacity-30">
                          <Users className="w-12 h-12" />
                          <span className="text-[9px] font-black uppercase tracking-widest">No worker identities found</span>
                      </div>
                   ) : workers.map((worker) => (
                      <div key={worker._id} className="p-5 md:p-8 hover:bg-white/[0.02] transition-all group border-l-2 border-transparent hover:border-[#ffc800]">
                           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-slate-900 border border-white/10 flex items-center justify-center font-black text-xl text-[#ffc800] -skew-x-6">
                                    <span className="skew-x-6 uppercase">{worker.name.charAt(0)}</span>
                                 </div>
                                 <div className="space-y-1">
                                    <div className="text-sm md:text-base font-black uppercase tracking-tight text-white group-hover:text-[#ffc800] transition-colors">{worker.name}</div>
                                    <div className="flex flex-wrap items-center gap-2">
                                       <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest px-2 py-0.5 border border-white/5">ID: {worker.workerId}</span>
                                       <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 flex items-center gap-1">
                                          <ShieldCheck className="w-3 h-3" /> SECURED
                                       </span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex gap-2 w-full sm:w-auto">
                                 <button onClick={() => startEdit(worker)} className="flex-1 sm:flex-none p-2.5 border border-white/5 hover:bg-[#ffc800] hover:text-black transition-all">
                                    <Edit2 className="w-4 h-4 mx-auto" />
                                 </button>
                                 <button onClick={() => handleDelete(worker._id)} className="flex-1 sm:flex-none p-2.5 border border-white/5 hover:bg-rose-500 hover:text-white transition-all">
                                    <Trash2 className="w-4 h-4 mx-auto" />
                                 </button>
                              </div>
                           </div>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-white/5 border border-white/5">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 bg-black/40 flex items-center justify-center border border-white/5">
                                    <Mail className="w-3.5 h-3.5 text-[#ffc800]" />
                                 </div>
                                 <div className="overflow-hidden">
                                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Internal Portal</span>
                                    <span className="text-[10px] font-bold text-slate-300 lowercase truncate block">{worker.email}</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 bg-black/40 flex items-center justify-center border border-white/5">
                                    <Phone className="w-3.5 h-3.5 text-[#ffc800]" />
                                 </div>
                                 <div>
                                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Field Call-ID</span>
                                    <span className="text-[10px] font-bold text-slate-300 block">{worker.phone}</span>
                                 </div>
                              </div>
                              <div className="sm:col-span-2 flex items-start gap-3 mt-1 pt-4 border-t border-white/5">
                                 <div className="w-8 h-8 bg-black/40 flex items-center justify-center border border-white/5 shrink-0">
                                    <MapPin className="w-3.5 h-3.5 text-[#ffc800]" />
                                 </div>
                                 <div className="overflow-hidden">
                                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Deployment Zone / Address</span>
                                    <span className="text-[10px] font-bold text-slate-300 leading-tight uppercase tracking-tight block truncate sm:whitespace-normal">{worker.address}</span>
                                 </div>
                              </div>
                           </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
      </main>
    </div>
  );
}
