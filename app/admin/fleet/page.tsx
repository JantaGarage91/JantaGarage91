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
  Edit2,
  Trash2,
  X,
  Zap,
  Tag,
  Hash,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Wrench,
  Upload,
  Loader2,
  FileText,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminFleet() {
  const [user, setUser] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    bikeModel: "",
    vehicleNumber: "",
    category: "BIKE",
    cc: "",
    image: "",
    pricePerDay: "",
    status: "AVAILABLE",
    isActive: true,
    description: ""
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
    fetchVehicles();
  }, [router]);

  const fetchVehicles = async () => {
    try {
      const res = await fetch("/api/bikes");
      const data = await res.json();
      if (res.ok) setVehicles(data);
    } catch (err) {
      console.error("Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatus("Uploading Image to Cloud...");
    
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", "rentrip_preset");
    
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dgkxgnckv";
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formDataUpload
      );
      setFormData({ ...formData, image: res.data.secure_url });
      setStatus("✅ Image Loaded Successfully!");
      setTimeout(() => setStatus(""), 2000);
    } catch (err) {
      console.error("Upload Error:", err);
      setStatus("❌ Image Upload Failed. Please check 'rentrip_preset' exists.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(isEditing ? "Updating Vehicle..." : "Processing New Entry...");
    
    try {
      const method = isEditing ? "PUT" : "POST";
      const payload = { 
        ...formData, 
        description: formData.description || "Premium vehicle from our elite fleet." 
      };
      
      const res = await fetch("/api/bikes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus(`✅ ${isEditing ? 'Updated' : 'Added'} Successfully!`);
        resetForm();
        fetchVehicles();
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

  const toggleBikeVisibility = async (id: string, current: boolean) => {
    try {
      const res = await fetch("/api/bikes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !current })
      });
      if (res.ok) fetchVehicles();
    } catch (err) {
      alert("Visibility toggle failed.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to PERMANENTLY remove this vehicle?")) return;
    try {
        const res = await fetch(`/api/bikes?id=${id}`, { method: "DELETE" });
        if (res.ok) {
           fetchVehicles();
           alert("Vehicle Removed from Fleet.");
        }
    } catch (err) {
        alert("Delete failed.");
    }
  };

  const startEdit = (vehicle: any) => {
    setIsEditing(true);
    setFormData({
      id: vehicle._id,
      name: vehicle.name,
      bikeModel: vehicle.bikeModel,
      vehicleNumber: vehicle.vehicleNumber,
      category: vehicle.category,
      cc: vehicle.cc.toString(),
      image: vehicle.image,
      pricePerDay: (vehicle.pricePerDay || 0).toString(),
      status: vehicle.status,
      isActive: vehicle.isActive ?? true,
      description: vehicle.description || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ id: "", name: "", bikeModel: "", vehicleNumber: "", category: "BIKE", cc: "", image: "", pricePerDay: "", status: "AVAILABLE", isActive: true, description: "" });
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
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">FLEET HUB <span className="text-[#ffc800]">CONTROL</span></h1>
              <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Asset Registry • Add & Manage Inventory</p>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-none border border-white/5 w-full md:w-auto">
               <div className="text-right flex-1 md:flex-none">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#ffc800]">{user.name}</div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-blue-500">ADMIN CONTROL</div>
               </div>
               <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-800 border border-slate-700 flex items-center justify-center -skew-x-6">
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
                         {isEditing ? "Machine Modification" : "Inventory Provisioning"}
                      </h3>
                   </div>
                   {isEditing && (
                      <button onClick={resetForm} className="p-2 border border-white/10 hover:bg-red-500 transition-colors">
                         <X className="w-4 h-4" />
                      </button>
                   )}
                </div>

                <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Type of Vehicle</label>
                         <div className="flex gap-2">
                            {["BIKE", "SCOOTY"].map(type => (
                               <button 
                                  key={type}
                                  type="button"
                                  onClick={() => setFormData({...formData, category: type as "BIKE" | "SCOOTY"})}
                                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${
                                     formData.category === type ? 'bg-[#ffc800] text-black border-[#ffc800]' : 'bg-slate-900/50 text-slate-500 border-white/5 hover:border-white/20'
                                  }`}
                               >
                                  {type}
                               </button>
                            ))}
                         </div>
                    </div>

                    <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Vehicle Name</label>
                         <input 
                            type="text" 
                            placeholder="Classic 350" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-[#020617] border border-white/10 px-4 py-3.5 text-xs font-bold focus:outline-none focus:border-[#ffc800] transition-colors" 
                         />
                    </div>
                    <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Model / Brand</label>
                         <input 
                            type="text" 
                            placeholder="Royal Enfield" 
                            required
                            value={formData.bikeModel}
                            onChange={(e) => setFormData({...formData, bikeModel: e.target.value})}
                            className="w-full bg-[#020617] border border-white/10 px-4 py-3.5 text-xs font-bold focus:outline-none focus:border-[#ffc800] transition-colors" 
                         />
                    </div>

                    <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Vehicle Number</label>
                         <div className="relative">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                            <input 
                               type="text" 
                               placeholder="UP78-BK-1234" 
                               required
                               value={formData.vehicleNumber}
                               onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                               className="w-full bg-[#020617] border border-white/10 pl-10 pr-4 py-3.5 text-xs font-bold focus:outline-none focus:border-[#ffc800] transition-colors" 
                            />
                         </div>
                    </div>
                    <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Engine CC</label>
                         <div className="relative">
                            <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                            <input 
                               type="number" 
                               placeholder="350" 
                               required
                               value={formData.cc}
                               onChange={(e) => setFormData({...formData, cc: e.target.value})}
                               className="w-full bg-[#020617] border border-white/10 pl-10 pr-4 py-3.5 text-xs font-bold focus:outline-none focus:border-[#ffc800] transition-colors" 
                            />
                         </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Vehicle Appearance (Photo)</label>
                         <div className={`relative border border-dashed p-6 lg:p-10 transition-all flex flex-col items-center justify-center gap-4 ${
                            formData.image ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-[#020617] hover:border-[#ffc800]/50'
                         }`}>
                            {isUploading ? (
                               <div className="flex flex-col items-center gap-3">
                                  <Loader2 className="w-8 h-8 text-[#ffc800] animate-spin" />
                                  <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Syncing Cloud...</span>
                               </div>
                            ) : formData.image ? (
                               <div className="relative group/img w-full h-40">
                                  <img src={formData.image} className="w-full h-full object-contain" />
                                  <button 
                                     type="button"
                                     onClick={() => setFormData({...formData, image: ""})}
                                     className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-none opacity-0 group-hover/img:opacity-100 transition-opacity"
                                  >
                                     <Trash2 className="w-4 h-4" />
                                  </button>
                               </div>
                            ) : (
                               <>
                                  <Upload className="w-8 h-8 text-slate-700" />
                                  <div className="text-center">
                                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Click to Upload Asset</p>
                                     <p className="text-[7px] font-bold text-slate-700 mt-1 uppercase">MAX 5MB • JPG/PNG</p>
                                  </div>
                                  <input 
                                     type="file" 
                                     accept="image/*"
                                     onChange={handleImageUpload}
                                     className="absolute inset-0 opacity-0 cursor-pointer" 
                                  />
                               </>
                            )}
                         </div>
                    </div>

                    <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Price Per Day (₹)</label>
                         <input 
                            type="number" 
                            placeholder="800" 
                            required
                            value={formData.pricePerDay}
                            onChange={(e) => setFormData({...formData, pricePerDay: e.target.value})}
                            className="w-full bg-[#020617] border border-white/10 px-4 py-3.5 text-xs font-bold focus:outline-none focus:border-[#ffc800] transition-colors" 
                         />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Short Description</label>
                         <div className="relative">
                            <FileText className="absolute left-4 top-4 w-3.5 h-3.5 text-slate-600" />
                            <textarea 
                               placeholder="Special notes..."
                               rows={3}
                               value={formData.description}
                               onChange={(e) => setFormData({...formData, description: e.target.value})}
                               className="w-full bg-[#020617] border border-white/10 pl-10 pr-4 py-3 text-xs font-bold focus:outline-none focus:border-[#ffc800] transition-colors" 
                            />
                         </div>
                    </div>

                    <div className="md:col-span-2 pt-4">
                        {status && <div className={`mb-4 text-[9px] font-black uppercase tracking-widest ${status.includes('❌') ? 'text-red-500' : 'text-emerald-500'}`}>{status}</div>}
                        <button 
                            type="submit" 
                            disabled={isSubmitting || isUploading}
                            className="w-full bg-[#ffc800] hover:bg-white text-black font-black uppercase tracking-widest text-[10px] py-4 transition-all shadow-[0_5px_20px_rgba(255,200,0,0.15)] active:scale-[0.98]"
                        >
                            {isSubmitting ? "SYNCING..." : isUploading ? "UPLOADING..." : isEditing ? "Update Machine Details" : "Provision New Vehicle"}
                        </button>
                    </div>
                </form>
             </div>

             {/* List Section */}
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ffc800]">Fleet Inventory</h3>
                   <span className="text-[9px] font-black uppercase bg-white/5 border border-white/5 px-3 py-1">{vehicles.length} Units</span>
                </div>

                <div className="bg-[#0f172a] border border-white/5 overflow-hidden divide-y divide-white/5 shadow-xl">
                   {loading ? (
                       <div className="p-12 text-center text-[9px] font-black uppercase text-slate-700 tracking-[0.5em] animate-pulse">Loading Stream...</div>
                   ) : vehicles.length === 0 ? (
                       <div className="p-12 text-center flex flex-col items-center gap-4 opacity-30">
                           <BikeIcon className="w-10 h-10" />
                           <span className="text-[9px] font-black uppercase tracking-widest">No machines detected</span>
                       </div>
                   ) : vehicles.map((v) => (
                      <div key={v._id} className="p-5 md:p-6 hover:bg-white/[0.02] transition-colors group">
                           <div className="flex flex-col sm:flex-row gap-5 md:gap-6">
                              <div className="w-full sm:w-32 h-40 sm:h-20 bg-slate-900 border border-white/5 rounded-none overflow-hidden shrink-0">
                                 <img src={v.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                              </div>
                              <div className="flex-1 space-y-2">
                                 <div className="flex justify-between items-start gap-4">
                                    <div className="text-sm md:text-base font-black uppercase tracking-tight text-white group-hover:text-[#ffc800] transition-colors">{v.name}</div>
                                    <div className="flex gap-2">
                                       <button onClick={() => startEdit(v)} className="p-2 border border-white/10 hover:bg-[#ffc800] hover:text-black transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                                       <button onClick={() => handleDelete(v._id)} className="p-2 border border-white/10 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                 </div>
                                 <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                    <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase flex items-center gap-1">
                                       <Tag className="w-2.5 h-2.5" /> {v.category}
                                    </span>
                                    <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase flex items-center gap-1">
                                       <Zap className="w-2.5 h-2.5" /> {v.cc} CC
                                    </span>
                                    <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase flex items-center gap-1">
                                       <Hash className="w-2.5 h-2.5" /> {v.vehicleNumber}
                                    </span>
                                 </div>
                                 <div className="pt-2 flex flex-wrap items-center gap-3 md:gap-4">
                                    <div className="text-[10px] md:text-[11px] font-black text-[#ffc800]">₹{v.pricePerDay} <span className="text-slate-600">/ Day</span></div>
                                    <div className={`text-[8px] md:text-[9px] font-black uppercase px-2 py-0.5 border ${
                                       v.status === 'AVAILABLE' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : 'border-amber-500/30 text-amber-500 bg-amber-500/5'
                                    }`}>
                                       {v.status}
                                    </div>
                                    <button 
                                       onClick={() => toggleBikeVisibility(v._id, v.isActive)}
                                       className={`text-[8px] md:text-[9px] font-black uppercase px-2 py-0.5 border transition-all ${
                                         v.isActive ? 'border-blue-500/30 text-blue-500 bg-blue-500/5 hover:bg-blue-500 hover:text-white' : 'border-slate-700 text-slate-500 bg-slate-900 hover:bg-white hover:text-black'
                                       }`}
                                    >
                                       {v.isActive ? 'ACTIVE' : 'OFFLINE'}
                                    </button>
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
