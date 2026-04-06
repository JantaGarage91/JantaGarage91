"use client";

import { X, Calendar, Clock, Bike, User, ShieldCheck, Mail, MapPin, CreditCard, ChevronRight, Hash, Download, ExternalLink } from "lucide-react";

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

export default function BookingDetailModal({ isOpen, onClose, booking }: BookingDetailModalProps) {
  if (!isOpen || !booking) return null;

  const { user, bike } = booking;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 md:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[95vh] flex flex-col animate-in fade-in zoom-in-95 duration-300">
        <div className="absolute inset-0 -skew-x-2 bg-[#ffc800]/5 translate-y-2 translate-x-1 blur-sm hidden md:block" />
        
        <div className="relative bg-[#020617] border border-white/10 flex flex-col h-full overflow-hidden text-white font-sansSelection shadow-2xl">
          {/* Header */}
          <div className="p-5 md:p-8 border-b border-white/10 flex items-center justify-between bg-slate-900/50 shrink-0">
            <div className="flex items-center gap-3 md:gap-5">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-[#ffc800] border-2 border-black flex items-center justify-center -skew-x-12 shrink-0">
                <Bike className="w-5 h-5 md:w-7 md:h-7 text-black skew-x-12" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter italic leading-tight mb-1 truncate">
                  MISSION <span className="text-[#ffc800]">MANIFEST</span>
                </h2>
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                   <div className="text-[7px] md:text-[10px] bg-slate-800 px-1.5 md:px-2 py-0.5 font-bold uppercase tracking-widest text-[#ffc800]">REG: {booking.bookingId}</div>
                   <div className={`text-[7px] md:text-[10px] px-1.5 md:px-2 py-0.5 font-bold uppercase tracking-widest ${
                     booking.status === "CONFIRMED" ? "bg-emerald-500/20 text-emerald-500" : "bg-slate-700 text-slate-400"
                   }`}>Status: {booking.status}</div>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 md:w-10 md:h-10 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all shrink-0 ml-4"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar space-y-8 md:space-y-10">
            
            {/* Primary Grid: Rider & Machine */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
               
               {/* Section 1: Machine Specification */}
               <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-3 text-slate-400">
                     <Hash className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#ffc800]" />
                     <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Vehicle Specification</h3>
                  </div>
                  <div className="bg-white/5 border border-white/5 p-4 md:p-6 space-y-4 md:space-y-6 relative group overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity hidden md:block">
                        <Bike className="w-24 h-24" />
                     </div>
                     
                     <div className="space-y-4 relative z-10">
                        <div>
                           <p className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Assigned Unit</p>
                           <p className="text-xl md:text-2xl font-black uppercase italic tracking-tighter truncate">{bike?.name || "N/A"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                           <div className="bg-black/40 p-2.5 md:p-3 border border-white/5">
                              <p className="text-[7px] md:text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Plate Number</p>
                              <p className="text-[10px] md:text-xs font-black text-emerald-500 uppercase truncate">{bike?.vehicleNumber || "NOT_ASSIGNED"}</p>
                           </div>
                           <div className="bg-black/40 p-2.5 md:p-3 border border-white/10 flex items-center justify-center">
                              <p className="text-[9px] md:text-[10px] font-black text-white italic uppercase tracking-tighter">Premium Fleet</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Section 2: Rider Intelligence */}
               <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-3 text-slate-400">
                     <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#ffc800]" />
                     <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Rider Intelligence</h3>
                  </div>
                  <div className="bg-white/5 border border-white/5 p-4 md:p-6 space-y-4 md:space-y-6">
                     <div className="flex items-center gap-4 md:gap-5">
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-slate-800 rounded-none flex items-center justify-center font-black text-[#ffc800] text-lg md:text-xl border border-[#ffc800]/20 shrink-0">
                           {user?.name?.charAt(0) || "U"}
                        </div>
                        <div className="min-w-0">
                           <p className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Verified Operator</p>
                           <p className="text-lg md:text-xl font-black uppercase tracking-tight truncate">{user?.name || "N/A"}</p>
                           <div className="flex items-center gap-1.5 text-slate-400 text-[8px] md:text-[10px] font-bold lowercase truncate mt-0.5">
                              <Mail className="w-2.5 h-2.5 md:w-3 md:h-3" />
                              {user?.email || "N/A"}
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                        <div className="flex-1 px-3 md:px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[8px] md:text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                           <ShieldCheck className="w-3 h-3" />
                           {user?.aadhaarUrl ? "Aadhaar Verified" : "Aadhaar Pending"}
                        </div>
                        <div className="flex-1 px-3 md:px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[8px] md:text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                           <ShieldCheck className="w-3 h-3" />
                           {user?.dlUrl ? "License Verified" : "License Pending"}
                        </div>
                     </div>
                  </div>
               </div>

            </div>

            {/* Financial & Schedule Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
               
               {/* Timeline */}
               <div className="lg:col-span-2 space-y-3 md:space-y-4">
                  <div className="flex items-center gap-3 text-slate-400">
                     <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#ffc800]" />
                     <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Operational Timeline</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 border border-white/5 bg-white/5">
                     <div className="p-4 md:p-6 border-b md:border-b-0 md:border-r border-white/10 bg-slate-900/30">
                        <p className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 md:mb-3 flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Pickup Sequence
                        </p>
                        <div className="flex items-baseline gap-2">
                           <span className="text-xl md:text-2xl font-black italic">{booking.pickupDate}</span>
                        </div>
                        <p className="text-[8px] md:text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{booking.pickupTime}</p>
                     </div>
                     <div className="p-4 md:p-6 bg-slate-900/30">
                        <p className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 md:mb-3 flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div> Dropoff Sequence
                        </p>
                        <div className="flex items-baseline gap-2">
                           <span className="text-xl md:text-2xl font-black italic">{booking.dropoffDate}</span>
                        </div>
                        <p className="text-[8px] md:text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{booking.dropoffTime}</p>
                     </div>
                  </div>
               </div>

               {/* Financials */}
               <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-3 text-slate-400">
                     <CreditCard className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#ffc800]" />
                     <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Fleet Revenue</h3>
                  </div>
                  <div className="bg-[#ffc800] p-5 md:p-6 h-full flex flex-col justify-between -skew-x-2 md:-skew-x-6">
                     <div className="skew-x-2 md:skew-x-6">
                        <p className="text-[7px] md:text-[9px] font-black text-black/60 uppercase tracking-widest">Total Transaction Value</p>
                        <p className="text-3xl md:text-4xl font-black text-black italic tracking-tighter mt-1">₹{booking.totalPrice?.toLocaleString()}</p>
                     </div>
                     <div className="skew-x-2 md:skew-x-6 pt-3 md:pt-4 border-t border-black/10 mt-3 md:mt-4 flex justify-between items-center text-[8px] md:text-[10px] font-black text-black uppercase tracking-widest">
                        <span>Duration Locked</span>
                        <span>{booking.duration} DAYS</span>
                     </div>
                  </div>
               </div>

            </div>

            {/* Document Gallery (KYC Integration) */}
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#ffc800]" />
                  <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Identity Documentation</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Aadhaar Card */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <p className="text-[7px] md:text-[8px] font-black uppercase text-slate-500">Government ID (Aadhaar)</p>
                      {user?.aadhaarUrl && (
                        <div className="flex gap-2">
                          <a href={user.aadhaarUrl} target="_blank" className="p-1 hover:text-[#ffc800] transition-colors"><ExternalLink className="w-3 h-3 text-white/40 hover:text-white" /></a>
                        </div>
                      )}
                    </div>
                    <div className="aspect-[1.8/1] bg-slate-950 border border-white/10 relative group p-1.5 flex items-center justify-center overflow-hidden">
                       {user?.aadhaarUrl ? (
                         <>
                           <img src={user.aadhaarUrl} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" alt="Aadhaar" />
                           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <a href={user.aadhaarUrl} target="_blank" className="bg-[#ffc800] text-black px-4 py-2 font-black text-[8px] md:text-[9px] uppercase tracking-widest">FULL SCAN ASSET</a>
                           </div>
                         </>
                       ) : (
                         <div className="text-center font-black text-[8px] uppercase tracking-widest opacity-20">Identity Signal Offline</div>
                       )}
                    </div>
                  </div>

                  {/* Driver License */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <p className="text-[7px] md:text-[8px] font-black uppercase text-slate-500">Operator License (DL)</p>
                      {user?.dlUrl && (
                        <div className="flex gap-2">
                          <a href={user.dlUrl} target="_blank" className="p-1 hover:text-[#ffc800] transition-colors"><ExternalLink className="w-3 h-3 text-white/40 hover:text-white" /></a>
                        </div>
                      )}
                    </div>
                    <div className="aspect-[1.8/1] bg-slate-950 border border-white/10 relative group p-1.5 flex items-center justify-center overflow-hidden">
                       {user?.dlUrl ? (
                         <>
                           <img src={user.dlUrl} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" alt="DL" />
                           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <a href={user.dlUrl} target="_blank" className="bg-[#ffc800] text-black px-4 py-2 font-black text-[8px] md:text-[9px] uppercase tracking-widest">FULL SCAN ASSET</a>
                           </div>
                         </>
                       ) : (
                         <div className="text-center font-black text-[8px] uppercase tracking-widest opacity-20">License Signal Offline</div>
                       )}
                    </div>
                  </div>
               </div>
            </div>

          </div>

          {/* Action Footer */}
          <div className="p-5 md:p-8 border-t border-white/10 bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
             <div className="flex items-center gap-2 text-[6px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Secure Protocol • HIMALAYAN_RIDER_OPERATIONS • SYSTEM_V3.0
             </div>
             <button 
              onClick={onClose}
              className="w-full sm:w-auto px-10 py-3 bg-white hover:bg-[#ffc800] text-black text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_5px_15px_rgba(255,255,255,0.1)]"
             >
                Close Manifest
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
