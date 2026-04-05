"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReviewsSlider from "@/components/ReviewsSlider";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import AuthModal from "@/components/AuthModal";
import { 
  ChevronRight, 
  ArrowRight, 
  MapPin, 
  Map as MapIcon, 
  Calendar, 
  Clock, 
  Star, 
  ShieldCheck, 
  Banknote, 
  CheckCircle2,
  Trophy,
  Shield,
  Bike,
  Phone,
} from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const [bookingForm, setBookingForm] = useState({
    pickupDate: "",
    pickupTime: "",
    dropoffDate: "",
    dropoffTime: "",
    city: "Kanpur"
  });

  const handleHeroFindBike = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    // Save to localStorage so rent-bikes can pick it up
    localStorage.setItem("heroBookingForm", JSON.stringify(bookingForm));
    router.push("/rent-bikes");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(userData) => setUser(userData)}
      />

      {/* Premium Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex flex-col items-center justify-center overflow-hidden">
        {/* Cinematic Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 scale-105" 
          style={{ 
            backgroundImage: "url('/bghero.png')",
            backgroundPosition: "center 40%"
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
        </div>
        
        {/* Center Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center space-y-8 pt-28 animate-in fade-in slide-in-from-top-12 duration-1000">
          <div className="flex flex-col items-center space-y-4">
             {/* Hero Logo */}
             <div className="text-3xl font-black italic tracking-tighter uppercase text-white/40 mb-2">
               HIMALAYAN <span className="text-[#ffc800]">RIDER</span>
             </div>
             
             <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter shadow-text leading-[0.85] flex flex-col">
               <span>RENT BIKE IN</span>
               <span className="text-[#ffc800] animate-pulse inline-block">KANPUR</span>
             </h1>
             
             <div className="space-y-8 max-w-3xl flex flex-col items-center">
               <p className="text-base md:text-xl text-slate-200 font-bold tracking-wide leading-tight drop-shadow-lg">
                 Rent from India&apos;s Largest Fleet of Motorcycles, <br className="hidden md:block" />
                 Trusted by millions.
               </p>

               {!user && (
                 <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-[#ffc800] text-black px-12 py-4 -skew-x-12 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-all shadow-[0_0_50px_rgba(255,200,0,0.3)] active:scale-95 group"
                 >
                   <span className="skew-x-12 flex items-center gap-3">
                     Login & Explore
                     <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </span>
                 </button>
               )}
             </div>
          </div>
        </div>
      </section>

      {/* High-Performance Search Hub */}
      <section className="relative z-30 mt-6 flex flex-col items-center">
        <div className="w-full max-w-7xl mx-auto px-6 space-y-6">
           {/* Racing Action Tab */}
           <div className="relative group w-fit mx-auto -mb-4 z-20">
              <div className="absolute inset-0 bg-slate-900/10 -skew-x-12 translate-x-1 translate-y-1"></div>
              <div className="relative bg-[#1e293b] text-white px-12 py-4 -skew-x-12 flex items-center gap-4 transition-transform active:scale-95 cursor-default">
                <div className="skew-x-12 flex items-center gap-3">
                  <MapIcon className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Rent Bikes</span>
                </div>
              </div>
           </div>

          {/* Parallelogram Search Console - Racing Edition */}
          <div className="relative group animate-in fade-in slide-in-from-bottom-10 duration-1000">
             
             {/* Skewed Card Background */}
             <div className="absolute inset-0 -skew-x-3 bg-gradient-to-br from-slate-50 via-white to-slate-50 border-[3.5px] border-slate-900 shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden">
               <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:28px_28px]"></div>
               <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#1e293b]/5 blur-[100px] pointer-events-none"></div>
             </div>
             {/* Straight Inner Content */}
             <div className="relative z-10 p-7 md:p-10">
               <form onSubmit={handleHeroFindBike} className="grid grid-cols-1 md:grid-cols-5 gap-8 items-end">
               
                 {/* Pick Up Date */}
                 <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Pick up Date</label>
                   <div className="relative -skew-x-12 bg-white border border-slate-200 hover:border-[#1e293b] transition-colors shadow-sm h-[48px] flex items-center transition-all">
                     <div className="skew-x-12 flex items-center w-full px-6 gap-3">
                       <input 
                        type="date" 
                        required
                        value={bookingForm.pickupDate}
                        onChange={(e) => setBookingForm({ ...bookingForm, pickupDate: e.target.value })}
                        className="bg-transparent w-full text-xs font-black text-slate-900 outline-none uppercase cursor-pointer" 
                       />
                     </div>
                   </div>
                 </div>

                 {/* Pick Up Time */}
                 <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Pick Time</label>
                   <div className="relative -skew-x-12 bg-white border border-slate-200 hover:border-[#1e293b] transition-colors shadow-sm h-[48px] flex items-center transition-all">
                     <div className="skew-x-12 flex items-center w-full px-6 gap-3">
                       <select 
                        required
                        value={bookingForm.pickupTime}
                        onChange={(e) => setBookingForm({ ...bookingForm, pickupTime: e.target.value })}
                        className="bg-transparent w-full text-[10px] font-black text-slate-900 outline-none appearance-none cursor-pointer uppercase"
                       >
                         <option value="">Time</option>
                         <option>09:00 AM</option>
                         <option>11:00 AM</option>
                         <option>02:00 PM</option>
                         <option>06:00 PM</option>
                       </select>
                     </div>
                   </div>
                 </div>

                 {/* Drop Off Date */}
                 <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Drop off</label>
                   <div className="relative -skew-x-12 bg-white border border-slate-200 hover:border-[#1e293b] transition-colors shadow-sm h-[48px] flex items-center transition-all">
                     <div className="skew-x-12 flex items-center w-full px-6 gap-3">
                       <input 
                        type="date" 
                        required
                        value={bookingForm.dropoffDate}
                        onChange={(e) => setBookingForm({ ...bookingForm, dropoffDate: e.target.value })}
                        className="bg-transparent w-full text-xs font-black text-slate-900 outline-none uppercase cursor-pointer" 
                       />
                     </div>
                   </div>
                 </div>

                 {/* Drop Time */}
                 <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Drop Time</label>
                   <div className="relative -skew-x-12 bg-white border border-slate-200 hover:border-[#1e293b] transition-colors shadow-sm h-[48px] flex items-center transition-all">
                     <div className="skew-x-12 flex items-center w-full px-6 gap-3">
                       <select 
                        required
                        value={bookingForm.dropoffTime}
                        onChange={(e) => setBookingForm({ ...bookingForm, dropoffTime: e.target.value })}
                        className="bg-transparent w-full text-[10px] font-black text-slate-900 outline-none appearance-none cursor-pointer uppercase"
                       >
                         <option value="">Time</option>
                         <option>09:00 AM</option>
                         <option>11:00 AM</option>
                         <option>02:00 PM</option>
                         <option>06:00 PM</option>
                       </select>
                     </div>
                   </div>
                 </div>

                 {/* Find Bike CTA */}
                 <div>
                   <button 
                    type="submit" 
                    onClick={(e) => {
                      const pickup = new Date(bookingForm.pickupDate);
                      const dropoff = new Date(bookingForm.dropoffDate);
                      if (pickup.getTime() === dropoff.getTime()) {
                        e.preventDefault();
                        alert("Same-day bookings are not available. Minimum rental period is 24 hours.");
                        return;
                      }
                      if (dropoff < pickup) {
                        e.preventDefault();
                        alert("Drop-off date must be after the pick-up date.");
                        return;
                      }
                    }}
                    className="relative w-full -skew-x-12 h-[48px] bg-slate-900 hover:bg-[#ffc800] group/btn transition-colors overflow-hidden shadow-lg shadow-black/20 active:scale-95 border-2 border-slate-900"
                   >
                     <div className="skew-x-12 flex items-center justify-center gap-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white group-hover/btn:text-black">Find Bike</span>
                       <ArrowRight className="w-4 h-4 text-[#ffc800] group-hover/btn:text-black group-hover/btn:translate-x-1 transition-all" />
                     </div>
                   </button>
                 </div>
               </form>
             </div>
          </div>
        </div>
      </section>

      {/* 4-Step Process Guide */}
      <HowItWorks />

      {/* Benefits Section - Inspired by Image */}
      <section className="bg-white py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
          
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-16 w-full">
            <div className="h-[2px] flex-1 bg-slate-100"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center px-4">
              Benefits of Choosing Self Drive Bike in Kanpur
            </h2>
            <div className="h-[2px] flex-1 bg-slate-100"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12 w-full">
            {[
              { 
                title: "No Riding Limits", 
                desc: "Odometer Won't Scare You Anymore.", 
                icon: MapPin,
                color: "text-blue-500"
              },
              { 
                title: "Freebies", 
                desc: "Helmets Always, Sometimes More.", 
                icon: Trophy,
                color: "text-[#ffc800]"
              },
              { 
                title: "No Bullshit", 
                desc: "A Day Rent is simply for 24 hrs, We mean it.", 
                icon: Clock,
                color: "text-amber-500"
              },
              { 
                title: "Verified Dealers", 
                desc: "Every Single Dealer is Committed to Quality Service.", 
                icon: CheckCircle2,
                color: "text-blue-600"
              },
              { 
                title: "Best Prices", 
                desc: "Lowest rental rates guaranteed for all models.", 
                icon: Shield,
                color: "text-indigo-500"
              },
              { 
                title: "24/7 Assistance", 
                desc: "We are available round the clock to help you.", 
                icon: Phone,
                color: "text-rose-500"
              }
            ].map((benefit, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className={`w-20 h-20 mb-6 flex items-center justify-center bg-slate-50 rounded-[1.5rem] border border-slate-100 transition-all group-hover:scale-110 duration-500 group-hover:bg-white group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]`}>
                  <benefit.icon className={`w-10 h-10 ${benefit.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 italic uppercase tracking-tighter">{benefit.title}</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Animated Reviews Slider */}
      <ReviewsSlider />

      {/* Frequently Asked Questions */}
      <FAQ />
    </div>
  );
}
