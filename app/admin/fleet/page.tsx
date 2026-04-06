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
  FileText
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
      <main className="flex-1 overflow-y-auto p-6 pt-24 lg:p-12 lg:pt-12">
          {/* Top Header */}
          <div className="flex justify-between items-center mb-12">
            <div className="space-y-1">
              <h1 className="text-3xl font-black uppercase tracking-tighter">FLEET HUB CONTROL</h1>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Asset Registry • Add & Manage Inventory</p>
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
             <div className="bg-[#0f172a] border border-slate-800 flex flex-col p-8 h-fit sticky top-0 shadow-2xl">
                <div className="flex justify-between items-start mb-8">
                   <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ffc800]">
                         {isEditing ? "Machine Modification" : "Inventory Provisioning"}
                      </h3>
                   </div>
                   {isEditing && (
                      <button onClick={resetForm} className="p-2 bg-slate-800 border border-slate-700 rounded hover:bg-red-500 transition-colors">
                         <X className="w-4 h-4" />
                      </button>
                   )}
                </div>

                <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Type of Vehicle</label>
                         <div className="flex gap-4">
                            {["BIKE", "SCOOTY"].map(type => (
                               <button 
                                  key={type}
                                  type="button"
                                  onClick={() => setFormData({...formData, category: type as "BIKE" | "SCOOTY"})}
                                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${
                                     formData.category === type ? 'bg-[#ffc800] text-black border-[#ffc800]' : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-600'
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
                            className="w-full bg-[#020617] border border-slate-800 px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#ffc800]" 
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
                            className="w-full bg-[#020617] border border-slate-800 px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#ffc800]" 
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
                               className="w-full bg-[#020617] border border-slate-800 pl-10 pr-4 py-3 text-sm font-bold focus:outline-none focus:border-[#ffc800]" 
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
                               className="w-full bg-[#020617] border border-slate-800 pl-10 pr-4 py-3 text-sm font-bold focus:outline-none focus:border-[#ffc800]" 
                            />
                         </div>
                    </div>

                    <div className="col-span-2 space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Vehicle Appearance (Upload Photo)</label>
                         <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-4 ${
                            formData.image ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 bg-[#020617] hover:border-[#ffc800]/50'
                         }`}>
                            {isUploading ? (
                               <div className="flex flex-col items-center gap-3">
                                  <Loader2 className="w-8 h-8 text-[#ffc800] animate-spin" />
                                  <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Syncing to Cloud...</span>
                               </div>
                            ) : formData.image ? (
                               <div className="relative group/img w-full h-40">
                                  <img src={formData.image} className="w-full h-full object-contain rounded-xl" />
                                  <button 
                                     type="button"
                                     onClick={() => setFormData({...formData, image: ""})}
                                     className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"
                                  >
                                     <Trash2 className="w-4 h-4" />
                                  </button>
                               </div>
                            ) : (
                               <>
                                  <Upload className="w-8 h-8 text-slate-700" />
                                  <div className="text-center">
                                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Drop Machine Image or Click to Browse</p>
                                     <p className="text-[8px] font-bold text-slate-700 mt-1">MAX SIZE 5MB • JPG/PNG/WEBP</p>
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
                            className="w-full bg-[#020617] border border-slate-800 px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#ffc800]" 
                         />
                    </div>

                    <div className="col-span-2 space-y-2">
                         <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Short Description (Optional)</label>
                         <div className="relative">
                            <FileText className="absolute left-4 top-4 w-3.5 h-3.5 text-slate-600" />
                            <textarea 
                               placeholder="Enter any special notes about this vehicle..."
                               rows={3}
                               value={formData.description}
                               onChange={(e) => setFormData({...formData, description: e.target.value})}
                               className="w-full bg-[#020617] border border-slate-800 pl-10 pr-4 py-3 text-sm font-bold focus:outline-none focus:border-[#ffc800]" 
                            />
                         </div>
                    </div>

                    <div className="col-span-2 pt-4">
                        {status && <div className={`mb-4 text-[10px] font-black uppercase tracking-widest ${status.includes('❌') ? 'text-red-500' : 'text-green-500'}`}>{status}</div>}
                        <button 
                            type="submit" 
                            disabled={isSubmitting || isUploading}
                            className="w-full bg-[#ffc800] hover:bg-white text-black font-black uppercase tracking-widest text-[10px] py-4 transition-all"
                        >
                            {isSubmitting ? "SYNCING..." : isUploading ? "WAITING FOR IMAGE..." : isEditing ? "Update Machine Details" : "Provision New Vehicle"}
                        </button>
                    </div>
                </form>
             </div>

             {/* List Section */}
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ffc800]">Fleet Inventory</h3>
                   <span className="text-[9px] font-black uppercase bg-slate-800 px-3 py-1 rounded-full">{vehicles.length} Units</span>
                </div>

                <div className="bg-[#0f172a] border border-slate-800 overflow-hidden divide-y divide-slate-800 shadow-xl">
                   {loading ? (
                       <div className="p-12 text-center text-[10px] font-black uppercase text-slate-700 tracking-[0.5em]">Fetching Inventory Stream...</div>
                   ) : vehicles.length === 0 ? (
                       <div className="p-12 text-center flex flex-col items-center gap-4">
                           <BikeIcon className="w-8 h-8 text-slate-800" />
                           <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">No vehicles found in fleet</span>
                       </div>
                   ) : vehicles.map((v) => (
                      <div key={v._id} className="p-6 hover:bg-white/[0.02] transition-colors group">
                           <div className="flex gap-6">
                              <div className="w-32 h-20 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shrink-0">
                                 <img src={v.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                              </div>
                              <div className="flex-1 space-y-1">
                                 <div className="flex justify-between items-start">
                                    <div className="text-sm font-black uppercase tracking-tight text-white group-hover:text-[#ffc800] transition-colors">{v.name}</div>
                                    <div className="flex gap-2">
                                       <button 
                                          onClick={() => toggleBikeVisibility(v._id, v.isActive)} 
                                          className={`p-1.5 rounded transition-all ${v.isActive ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}
                                          title={v.isActive ? "Deactivate" : "Activate"}
                                       >
                                          {v.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                       </button>
                                       <button onClick={() => startEdit(v)} className="p-1.5 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                                       <button onClick={() => handleDelete(v._id)} className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1">
                                       <Tag className="w-2.5 h-2.5" /> {v.category}
                                    </span>
                                    <span className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1">
                                       <Zap className="w-2.5 h-2.5" /> {v.cc} CC
                                    </span>
                                    <span className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1">
                                       <Hash className="w-2.5 h-2.5" /> {v.vehicleNumber}
                                    </span>
                                 </div>
                                 <div className="pt-2 flex items-center gap-4">
                                    <div className="text-[10px] font-black text-white">₹{v.pricePerDay} <span className="text-slate-600">/ Day</span></div>
                                    <div className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                       v.status === 'AVAILABLE' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                                    }`}>
                                       {v.status}
                                    </div>
                                    <div className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                       v.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                    }`}>
                                       {v.isActive ? 'ACTIVE' : 'DARK'}
                                    </div>
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
