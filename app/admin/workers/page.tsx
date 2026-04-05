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
  X
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
    <div className="min-h-screen bg-[#020617] text-slate-100 flex overflow-hidden font-sans">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12">
          {/* Top Header */}
          <div className="flex justify-between items-center mb-12">
            <div className="space-y-1">
              <h1 className="text-3xl font-black uppercase tracking-tighter">WORKER IDENTITY HUB</h1>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Manage Workforce • Edit/Modify Credentials</p>
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

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
             {/* Form Section */}
             <div className="bg-[#0f172a] border border-slate-800 flex flex-col p-8 h-fit sticky top-0">
                <div className="flex justify-between items-start mb-8">
                   <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ffc800]">
                         {isEditing ? "Identity Modification" : "Identity Provisioning"}
                      </h3>
                      <p className="text-slate-500 text-xs mt-2 font-medium">
                         {isEditing ? `Modifying profile for ${formData.workerId}` : "Create new encrypted credentials for field workers."}
                      </p>
                   </div>
                   {isEditing && (
                      <button onClick={resetForm} className="p-2 bg-slate-800 border border-slate-700 rounded hover:bg-red-500 transition-colors">
                         <X className="w-4 h-4" />
                      </button>
                   )}
                </div>

                <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
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
                               className="w-full bg-[#020617] border border-slate-800 pl-10 pr-4 py-3 text-sm font-bold focus:outline-none focus:border-[#ffc800] transition-colors disabled:opacity-50" 
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
                            className="w-full bg-[#020617] border border-slate-800 px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#ffc800] transition-colors" 
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Phone Line</label>
                         <input 
                            type="text" 
                            placeholder="+91 XXXXX XXXXX" 
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-[#020617] border border-slate-800 px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#ffc800] transition-colors" 
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
                            className="w-full bg-[#020617] border border-slate-800 px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#ffc800] transition-colors" 
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Permanent Residence Address</label>
                      <textarea 
                         placeholder="Current living address..." 
                         required
                         rows={3}
                         value={formData.address}
                         onChange={(e) => setFormData({...formData, address: e.target.value})}
                         className="w-full bg-[#020617] border border-slate-800 px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#ffc800] transition-colors resize-none" 
                      ></textarea>
                   </div>

                   <div className="space-y-2 pb-6">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Access Password</label>
                      <div className="relative">
                         <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                         <input 
                            type="text" 
                            placeholder="••••••••" 
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full bg-[#020617] border border-slate-800 pl-10 pr-4 py-3 text-sm font-bold focus:outline-none focus:border-[#ffc800] transition-colors" 
                         />
                      </div>
                   </div>

                   {status && (
                     <div className={`text-[10px] font-black uppercase tracking-widest mb-4 ${status.includes('❌') ? 'text-red-500' : 'text-green-500'}`}>
                        {status}
                     </div>
                   )}

                   <button 
                     type="submit" 
                     disabled={isSubmitting}
                     className="w-full bg-[#ffc800] hover:bg-white text-black font-black uppercase tracking-widest text-[10px] py-4 transition-all"
                   >
                      {isSubmitting ? "Processing..." : isEditing ? "Save Modifications" : "Create Identity"}
                   </button>
                </form>
             </div>

             {/* List Section */}
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ffc800]">Registered Workforce</h3>
                   <span className="text-[9px] font-black uppercase bg-slate-800 px-3 py-1 rounded-full">{workers.length} Members</span>
                </div>

                <div className="bg-[#0f172a] border border-slate-800 overflow-hidden divide-y divide-slate-800/50">
                   {loading ? (
                      <div className="p-12 text-center text-[10px] font-black uppercase text-slate-700 tracking-[0.5em]">Synchronizing...</div>
                   ) : workers.map((worker) => (
                      <div key={worker._id} className="p-6 hover:bg-white/[0.02] transition-colors group border-b border-slate-800 last:border-b-0">
                           <div className="flex justify-between items-start mb-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center font-black text-xl text-[#ffc800] border border-slate-700 shadow-lg shadow-black/20 italic uppercase">
                                    {worker.name.charAt(0)}
                                 </div>
                                 <div className="space-y-1">
                                    <div className="text-sm font-black uppercase tracking-tight text-white group-hover:text-[#ffc800] transition-colors">{worker.name}</div>
                                    <div className="flex items-center gap-2">
                                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-slate-900 px-2 py-0.5 rounded border border-slate-800">ID: {worker.workerId}</span>
                                       <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border bg-green-500/10 text-green-500 border-green-500/20 flex items-center gap-1.5">
                                          <Lock className="w-3 h-3" />
                                          Access Secured
                                       </span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex gap-2">
                                 <button onClick={() => startEdit(worker)} className="p-2.5 bg-slate-800/50 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-all opacity-40 group-hover:opacity-100">
                                    <Edit2 className="w-3.5 h-3.5" />
                                 </button>
                                 <button onClick={() => handleDelete(worker._id)} className="p-2.5 bg-slate-800/50 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-all opacity-40 group-hover:opacity-100">
                                    <Trash2 className="w-3.5 h-3.5" />
                                 </button>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-3 p-4 bg-[#020617]/50 rounded-2xl border border-slate-800/50">
                              <div className="flex items-center gap-3">
                                 <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800">
                                    <Mail className="w-3 h-3 text-[#ffc800]" />
                                 </div>
                                 <div>
                                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Email Access</span>
                                    <span className="text-[10px] font-bold text-slate-300 lowercase leading-none">{worker.email}</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800">
                                    <Phone className="w-3 h-3 text-[#ffc800]" />
                                 </div>
                                 <div>
                                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Phone Line</span>
                                    <span className="text-[10px] font-bold text-slate-300 leading-none">{worker.phone}</span>
                                 </div>
                              </div>
                              <div className="col-span-2 flex items-start gap-3 mt-1 pt-3 border-t border-slate-800/50">
                                 <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800 shrink-0">
                                    <MapPin className="w-3 h-3 text-[#ffc800]" />
                                 </div>
                                 <div>
                                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Registered Address</span>
                                    <span className="text-[10px] font-bold text-slate-300 leading-tight uppercase tracking-tight">{worker.address}</span>
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
