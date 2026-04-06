"use client";

import { AlertCircle, FileCheck, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KYCModal({ isOpen, onClose }: KYCModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white border-[4px] border-slate-900 shadow-[20px_40px_100px_rgba(0,0,0,0.25)] -skew-y-1 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="skew-y-1 flex flex-col items-center text-center p-8 md:p-12">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Icon */}
          <div className="w-20 h-20 bg-amber-50 border-2 border-amber-500/20 flex items-center justify-center -skew-x-6 mb-8">
            <AlertCircle className="w-10 h-10 text-amber-500 skew-x-6" />
          </div>

          {/* Text Content */}
          <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 italic mb-4">
            REGISTRATION <span className="text-[#ffc800]">INCOMPLETE</span>
          </h2>
          
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 leading-relaxed max-w-[280px] mb-10">
            Please complete your profile first by uploading your Aadhaar & Driving License to unlock our fleet access.
          </p>

          {/* Action Button */}
          <button 
            onClick={() => {
              onClose();
              router.push("/profile");
            }}
            className="w-full bg-[#020617] text-white py-5 px-8 flex items-center justify-center gap-3 group transition-all hover:bg-[#ffc800] hover:text-black border-l-4 border-[#ffc800]"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Complete Profile Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="mt-6 text-[8px] font-black uppercase tracking-widest text-slate-400">
            Estimated time: 30 seconds
          </p>
        </div>
        
        {/* Bottom Accent Decor */}
        <div className="h-2 bg-[#ffc800] w-full" />
      </div>
    </div>
  );
}
