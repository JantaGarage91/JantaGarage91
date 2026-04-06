"use client";

import { X, ShieldCheck, Download, ExternalLink, User } from "lucide-react";
import Image from "next/image";

interface KYCViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

export default function KYCViewModal({ isOpen, onClose, booking }: KYCViewModalProps) {
  if (!isOpen || !booking) return null;

  const { user } = booking;
  const hasAadhaar = !!user?.aadhaarUrl;
  const hasDL = !!user?.dlUrl;

  const handleDownload = (url: string, filename: string) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
      });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="absolute inset-0 -skew-x-2 bg-emerald-500/10 translate-y-2 translate-x-1 blur-sm" />
        
        <div className="relative bg-[#0f172a] border border-white/10 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center -skew-x-12">
                <ShieldCheck className="w-6 h-6 text-emerald-500 skew-x-12" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter italic text-white flex items-center gap-2">
                  KYC <span className="text-emerald-500">VERIFICATION</span>
                </h2>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Rider: {user?.name || "N/A"} • Booking: {booking.bookingId}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Aadhaar Card */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#ffc800]">Aadhaar Card Registry</h3>
                  <div className="flex gap-2">
                    {hasAadhaar && (
                      <>
                        <button 
                          onClick={() => handleDownload(user.aadhaarUrl, `Aadhaar_${user.name.replace(/ /g, "_")}.jpg`)}
                          className="p-1.5 bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-[#ffc800] transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <a 
                          href={user.aadhaarUrl} 
                          target="_blank" 
                          className="p-1.5 bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-[#ffc800] transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="aspect-[1.6/1] bg-slate-950 border-2 border-dashed border-white/5 relative group overflow-hidden flex items-center justify-center">
                  {hasAadhaar ? (
                    <img 
                      src={user.aadhaarUrl} 
                      alt="Aadhaar" 
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="text-center space-y-2 opacity-20">
                      <User className="w-12 h-12 mx-auto" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Document Not Found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Driving License */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400">Operator License (DL)</h3>
                  <div className="flex gap-2">
                    {hasDL && (
                      <>
                        <button 
                          onClick={() => handleDownload(user.dlUrl, `DL_${user.name.replace(/ /g, "_")}.jpg`)}
                          className="p-1.5 bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-blue-500 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <a 
                          href={user.dlUrl} 
                          target="_blank" 
                          className="p-1.5 bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-blue-500 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="aspect-[1.6/1] bg-slate-950 border-2 border-dashed border-white/5 relative group overflow-hidden flex items-center justify-center">
                  {hasDL ? (
                    <img 
                      src={user.dlUrl} 
                      alt="Driving License" 
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="text-center space-y-2 opacity-20">
                      <User className="w-12 h-12 mx-auto" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Document Not Found</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Verification Checklist */}
            <div className="bg-white/5 p-6 border border-white/5 space-y-4">
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Security Clearance Protocols</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${hasAadhaar ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Aadhaar Bio-Scan</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${hasDL ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Operator Authorization</span>
                </div>
                <div className="flex items-center gap-3 opacity-30">
                  <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Face Match Sync</span>
                </div>
                <div className="flex items-center gap-3 opacity-30">
                  <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Background Check</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-slate-900/50 flex justify-end gap-4">
             <button 
              onClick={onClose}
              className="px-8 py-3 bg-white hover:bg-[#ffc800] text-black text-[10px] font-black uppercase tracking-widest transition-all"
             >
                Close Secure View
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
