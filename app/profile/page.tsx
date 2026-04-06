"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, Calendar, LogOut, ChevronLeft, Upload, Loader2, CheckCircle2, FileText, AlertCircle } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isUploadingAadhaar, setIsUploadingAadhaar] = useState(false);
  const [isUploadingDl, setIsUploadingDl] = useState(false);
  const [updateStatus, setUpdateStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/auth/user");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    
    // Attempt to refresh profile silently if an API exists, but for now we rely on stored data.
    // If the data doesn't have aadhaarUrl, it will prompt upload.
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, doctype: "aadhaar" | "dl") => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (doctype === "aadhaar") setIsUploadingAadhaar(true);
    else setIsUploadingDl(true);
    
    setUpdateStatus("Uploading secure document to vault...");
    
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", "rentrip_preset");
    
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dgkxgnckv";
      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formDataUpload
      );
      
      const secureUrl = uploadRes.data.secure_url;
      
      // Save to database
      const dbRes = await fetch("/api/user/profile", {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            userId: user._id || user.id,
            ...(doctype === "aadhaar" ? { aadhaarUrl: secureUrl } : { dlUrl: secureUrl })
         })
      });
      
      const updatedUser = await dbRes.json();
      if (dbRes.ok) {
         // Update local storage so data persists across reloads
         const newUserData = { ...user, ...updatedUser };
         localStorage.setItem("user", JSON.stringify(newUserData));
         setUser(newUserData);
         setUpdateStatus("✅ Document Identity Updated Successfully!");
      } else {
         setUpdateStatus("❌ Vault Sync Failed.");
      }
    } catch (err) {
      console.error("Upload Error:", err);
      setUpdateStatus("❌ Upload execution failed.");
    } finally {
      if (doctype === "aadhaar") setIsUploadingAadhaar(false);
      else setIsUploadingDl(false);
      setTimeout(() => setUpdateStatus(""), 3000);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#ffc800] transition-colors text-[10px] font-black uppercase tracking-[0.2em] mb-12 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Profile Header */}
        <div className="relative mb-12">
          <div className="absolute inset-0 -skew-x-2 bg-[#ffc800]/10 translate-y-2 translate-x-1 blur-sm rounded-none" />
          <div className="relative bg-[#1e293b] border border-white/10 p-8 md:p-12 -skew-x-1 flex flex-col md:flex-row items-center gap-8 md:gap-12">
             <div className="skew-x-1">
                <div className="w-32 h-32 bg-[#ffc800] rounded-none -skew-x-6 flex items-center justify-center shadow-2xl shadow-yellow-500/20">
                  <span className="text-5xl font-black text-black skew-x-6">{user.name.charAt(0)}</span>
                </div>
             </div>
             
             <div className="skew-x-1 flex-1 text-center md:text-left">
               <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-2">{user.name}</h1>
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                 <span className="text-slate-500 text-xs font-bold flex items-center gap-2">
                   <Mail className="w-4 h-4" /> {user.email}
                 </span>
               </div>
             </div>
          </div>
        </div>

        {/* Info & Identity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Identity Verification Section */}
           <div className="bg-[#1e293b] border border-[#ffc800]/50 p-8 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffc800]/5 rounded-bl-full translate-x-12 -translate-y-12"></div>
              
              <div className="flex justify-between items-center relative z-10">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#ffc800] flex items-center gap-3">
                  <FileText className="w-4 h-4" /> KYC Verification
                </h2>
                {user.aadhaarUrl && user.dlUrl ? (
                   <span className="bg-green-500/20 text-green-500 border border-green-500/30 px-3 py-1 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 rounded-full">
                     <CheckCircle2 className="w-3 h-3" /> Fully Verified
                   </span>
                ) : (
                   <span className="bg-amber-500/20 text-amber-500 border border-amber-500/30 px-3 py-1 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 rounded-full">
                     <AlertCircle className="w-3 h-3" /> Action Required
                   </span>
                )}
              </div>
              
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider pb-2 relative z-10">Upload valid credentials to unlock full fleet access.</p>
              
              <div className="space-y-4 relative z-10">
                {/* Aadhaar Setup */}
                <div className={`p-5 flex flex-col gap-4 border transition-colors ${user.aadhaarUrl ? 'bg-[#0f172a] border-green-500/20' : 'bg-[#020617] border-slate-700/50 hover:border-[#ffc800]/30'}`}>
                   <div className="flex justify-between items-center">
                     <div>
                       <h3 className="text-sm font-black uppercase tracking-widest text-slate-200">Aadhaar Card</h3>
                       <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mt-1">Primary Indian ID</p>
                     </div>
                     {user.aadhaarUrl ? (
                       <CheckCircle2 className="w-6 h-6 text-green-500" />
                     ) : isUploadingAadhaar ? (
                       <Loader2 className="w-6 h-6 text-[#ffc800] animate-spin" />
                     ) : (
                       <label className="cursor-pointer bg-slate-800 hover:bg-[#ffc800] hover:text-black text-white w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg">
                          <Upload className="w-4 h-4" />
                          <input type="file" accept="image/*" onChange={(e) => handleDocumentUpload(e, "aadhaar")} className="hidden" />
                       </label>
                     )}
                   </div>
                   {user.aadhaarUrl && (
                     <div className="w-full h-32 relative group/img overflow-hidden rounded-lg border border-slate-800">
                        <img src={user.aadhaarUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105 opacity-80 group-hover/img:opacity-100" />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                           <label className="cursor-pointer px-4 py-2 bg-[#ffc800] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors">
                              Update Aadhaar
                              <input type="file" accept="image/*" onChange={(e) => handleDocumentUpload(e, "aadhaar")} className="hidden" />
                           </label>
                        </div>
                     </div>
                   )}
                </div>

                {/* DL Setup */}
                <div className={`p-5 flex flex-col gap-4 border transition-colors ${user.dlUrl ? 'bg-[#0f172a] border-green-500/20' : 'bg-[#020617] border-slate-700/50 hover:border-[#ffc800]/30'}`}>
                   <div className="flex justify-between items-center">
                     <div>
                       <h3 className="text-sm font-black uppercase tracking-widest text-slate-200">Driving License</h3>
                       <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mt-1">Required for RIDER Mode</p>
                     </div>
                     {user.dlUrl ? (
                       <CheckCircle2 className="w-6 h-6 text-green-500" />
                     ) : isUploadingDl ? (
                       <Loader2 className="w-6 h-6 text-[#ffc800] animate-spin" />
                     ) : (
                       <label className="cursor-pointer bg-slate-800 hover:bg-[#ffc800] hover:text-black text-white w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg">
                          <Upload className="w-4 h-4" />
                          <input type="file" accept="image/*" onChange={(e) => handleDocumentUpload(e, "dl")} className="hidden" />
                       </label>
                     )}
                   </div>
                   {user.dlUrl && (
                     <div className="w-full h-32 relative group/img overflow-hidden rounded-lg border border-slate-800">
                        <img src={user.dlUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105 opacity-80 group-hover/img:opacity-100" />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                           <label className="cursor-pointer px-4 py-2 bg-[#ffc800] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors">
                              Update DL
                              <input type="file" accept="image/*" onChange={(e) => handleDocumentUpload(e, "dl")} className="hidden" />
                           </label>
                        </div>
                     </div>
                   )}
                </div>
              </div>
              
              {updateStatus && (
                <div className={`text-[10px] font-black uppercase tracking-widest pt-2 ${updateStatus.includes('❌') ? 'text-red-500' : 'text-green-500'} animate-in fade-in`}>
                  {updateStatus}
                </div>
              )}
           </div>

           <div className="space-y-8">
             <div className="bg-[#1e293b] border border-white/10 p-8 space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#ffc800] flex items-center gap-3">
                <Shield className="w-4 h-4" /> Account Security
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                   <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Status</span>
                   <span className="text-green-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Active Account
                   </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                   <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Two-Factor</span>
                   <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Disabled</span>
                </div>
              </div>
           </div>

           <div className="bg-[#1e293b] border border-white/10 p-8 space-y-6">
               <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#ffc800] flex items-center gap-3">
                <Calendar className="w-4 h-4" /> Activity & Bookings
              </h2>
              <div className="space-y-4">
                 <div className="p-4 bg-[#0f172a] border border-white/5">
                    <p className="text-[10px] font-bold text-slate-300">Last login: Today at 12:45 PM</p>
                    <p className="text-[9px] text-slate-500 mt-1 uppercase font-black tracking-widest">Success from Kanpur, IN</p>
                 </div>
                 <Link href="/bookings" className="block w-full py-3 border border-white/10 text-center text-[9px] font-black uppercase tracking-widest hover:bg-[#ffc800] hover:text-black transition-all">
                    View My Bookings
                 </Link>
                 <button className="w-full py-3 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                   View Full Activity History
                 </button>
             </div>
           </div>
           </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-12 pt-12 border-t border-white/5">
           <button 
             onClick={() => {
               localStorage.removeItem("user");
               router.push("/");
               router.refresh();
             }}
             className="flex items-center gap-3 text-red-500 hover:text-red-400 font-black uppercase tracking-widest text-[10px] group transition-all"
           >
             <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             Permanently Sign Out Account
           </button>
        </div>
      </main>
    </div>
  );
}
