"use client";

import { X, Calendar, Clock, Bike, User, ShieldCheck, Mail, MapPin, CreditCard, ChevronRight, Hash } from "lucide-react";

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

export default function BookingDetailModal({ isOpen, onClose, booking }: BookingDetailModalProps) {
  if (!isOpen || !booking) return null;

  const { user, bike } = booking;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="absolute inset-0 -skew-x-2 bg-[#ffc800]/5 translate-y-2 translate-x-1 blur-sm" />
        
        <div className="relative bg-[#020617] border border-white/10 flex flex-col h-full overflow-hidden text-white font-sansSelection">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-[#ffc800] border-2 border-black flex items-center justify-center -skew-x-12">
                <Bike className="w-7 h-7 text-black skew-x-12" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter italic leading-none mb-1">
                  MISSION <span className="text-[#ffc800]">MANIFEST</span>
                </h2>
                <div className="flex items-center gap-3">
                   <div className="text-[10px] bg-slate-800 px-2 py-0.5 font-bold uppercase tracking-widest text-[#ffc800]">REG: {booking.bookingId}</div>
                   <div className={`text-[10px] px-2 py-0.5 font-bold uppercase tracking-widest ${
                     booking.status === "CONFIRMED" ? "bg-emerald-500/20 text-emerald-500" : "bg-slate-700 text-slate-400"
                   }`}>Status: {booking.status}</div>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
            
            {/* Primary Grid: Rider & Machine */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               
               {/* Section 1: Machine Specification */}
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-400">
                     <Hash className="w-4 h-4 text-[#ffc800]" />
                     <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Vehicle Specification</h3>
                  </div>
                  <div className="bg-white/5 border border-white/5 p-6 space-y-6 relative group overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                        <Bike className="w-24 h-24" />
                     </div>
                     
                     <div className="space-y-4 relative z-10">
                        <div>
                           <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Assigned Unit</p>
                           <p className="text-2xl font-black uppercase italic tracking-tighter">{bike?.name || "N/A"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-black/40 p-3 border border-white/5">
                              <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Plate Number</p>
                              <p className="text-xs font-black text-emerald-500 uppercase">{bike?.vehicleNumber || "NOT_ASSIGNED"}</p>
                           </div>
                           <div className="bg-black/40 p-3 border border-white/5">
                              <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Rate Lock</p>
                              <p className="text-xs font-black text-white italic uppercase">Premium Fleet</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Section 2: Rider Intelligence */}
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-400">
                     <User className="w-4 h-4 text-[#ffc800]" />
                     <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Rider Intelligence</h3>
                  </div>
                  <div className="bg-white/5 border border-white/5 p-6 space-y-6">
                     <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-slate-800 rounded-none flex items-center justify-center font-black text-[#ffc800] text-xl border border-[#ffc800]/20">
                           {user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                           <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Verified Operator</p>
                           <p className="text-xl font-black uppercase tracking-tight">{user?.name || "N/A"}</p>
                           <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold lowercase mt-1">
                              <Mail className="w-3 h-3" />
                              {user?.email || "N/A"}
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex gap-3">
                        <div className="flex-1 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                           <ShieldCheck className="w-3 h-3" />
                           {user?.aadhaarUrl ? "Aadhaar Found" : "Aadhaar Missing"}
                        </div>
                        <div className="flex-1 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                           <ShieldCheck className="w-3 h-3" />
                           {user?.dlUrl ? "License Found" : "License Missing"}
                        </div>
                     </div>
                  </div>
               </div>

            </div>

            {/* Financial & Schedule Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               
               {/* Timeline */}
               <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-3 text-slate-400">
                     <Clock className="w-4 h-4 text-[#ffc800]" />
                     <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Timeline</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 border border-white/5">
                     <div className="p-6 border-b md:border-b-0 md:border-r border-white/5 bg-slate-900/30">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Pickup Sequence
                        </p>
                        <div className="flex items-baseline gap-2">
                           <span className="text-2xl font-black italic">{booking.pickupDate}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{booking.pickupTime}</p>
                     </div>
                     <div className="p-6 bg-slate-900/30">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div> Dropoff Sequence
                        </p>
                        <div className="flex items-baseline gap-2">
                           <span className="text-2xl font-black italic">{booking.dropoffDate}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{booking.dropoffTime}</p>
                     </div>
                  </div>
               </div>

               {/* Financials */}
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-400">
                     <CreditCard className="w-4 h-4 text-[#ffc800]" />
                     <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Fleet Revenue</h3>
                  </div>
                  <div className="bg-[#ffc800] p-6 h-full flex flex-col justify-between -skew-x-6">
                     <div className="skew-x-6">
                        <p className="text-[9px] font-black text-black/60 uppercase tracking-widest">Total Transaction Value</p>
                        <p className="text-4xl font-black text-black italic tracking-tighter mt-1">₹{booking.totalPrice?.toLocaleString()}</p>
                     </div>
                     <div className="skew-x-6 pt-4 border-t border-black/10 mt-4 flex justify-between items-center text-[10px] font-black text-black uppercase tracking-widest">
                        <span>Duration Locked</span>
                        <span>{booking.duration} DAYS</span>
                     </div>
                  </div>
               </div>

            </div>

            {/* Document Gallery (KYC Integration) */}
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-[#ffc800]" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Identity Assets</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user?.aadhaarUrl ? (
                     <div className="aspect-[1.8/1] bg-slate-950 border border-white/5 relative group p-2">
                        <img src={user.aadhaarUrl} className="w-full h-full object-contain" alt="Aadhaar" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <a href={user.aadhaarUrl} target="_blank" className="bg-[#ffc800] text-black px-4 py-2 font-black text-[9px] uppercase tracking-widest">Expand Asset</a>
                        </div>
                        <div className="absolute top-4 left-4 bg-black/80 px-2 py-1 text-[7px] font-black uppercase tracking-widest">Aadhaar Card</div>
                     </div>
                  ) : (
                     <div className="aspect-[1.8/1] bg-slate-950 border border-white/5 flex items-center justify-center opacity-20">
                        <div className="text-center font-black text-[9px] uppercase tracking-widest">AADHAAR_SIGNAL_OFFLINE</div>
                     </div>
                  )}
                  {user?.dlUrl ? (
                     <div className="aspect-[1.8/1] bg-slate-950 border border-white/5 relative group p-2">
                        <img src={user.dlUrl} className="w-full h-full object-contain" alt="DL" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <a href={user.dlUrl} target="_blank" className="bg-[#ffc800] text-black px-4 py-2 font-black text-[9px] uppercase tracking-widest">Expand Asset</a>
                        </div>
                        <div className="absolute top-4 left-4 bg-black/80 px-2 py-1 text-[7px] font-black uppercase tracking-widest">Driver License</div>
                     </div>
                  ) : (
                     <div className="aspect-[1.8/1] bg-slate-950 border border-white/5 flex items-center justify-center opacity-20">
                        <div className="text-center font-black text-[9px] uppercase tracking-widest">DL_SIGNAL_OFFLINE</div>
                     </div>
                  )}
               </div>
            </div>

          </div>

          {/* Action Footer */}
          <div className="p-6 border-t border-white/10 bg-slate-900/50 flex justify-between items-center">
             <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Secure Protocol • HIMALAYAN_RIDER_OPERATIONS
             </div>
             <button 
              onClick={onClose}
              className="px-10 py-3 bg-white hover:bg-[#ffc800] text-black text-[10px] font-black uppercase tracking-widest transition-all"
             >
                Close Manifest
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
