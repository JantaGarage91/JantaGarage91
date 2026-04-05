"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Bike as BikeIcon, 
  ChevronRight, 
  CheckCircle2, 
  History,
  Package,
  ExternalLink,
  Loader2,
  Lock
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MyBookingsPage() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchUserBookings(userData.email);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserBookings = async (email: string) => {
    setLoading(true);
    try {
      // We can use the existing bookings API but we'll need to filter it
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (res.ok) {
        const userBookings = data.filter((b: any) => b.user?.email === email);
        setBookings(userBookings);
      } else {
        setError("Unable to load booking history.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user && !loading) {
     return (
       <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
          <div className="bg-white border-2 border-slate-900 p-12 text-center -skew-x-2 shadow-[20px_20px_0_rgba(0,0,0,0.05)]">
             <div className="skew-x-2 flex flex-col items-center gap-6">
                <div className="w-16 h-16 bg-[#ffc800] rounded-2xl flex items-center justify-center shadow-lg">
                   <Lock className="w-8 h-8 text-black" />
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tighter italic">ACCESS RESTRICTED</h1>
                <p className="text-slate-500 font-bold max-w-xs uppercase text-[10px] tracking-widest">Please log in to view your high-performance booking history.</p>
                <Link href="/auth/user" className="bg-black text-[#ffc800] px-12 py-4 font-black uppercase tracking-widest text-[10px] hover:bg-[#ffc800] hover:text-black transition-all active:scale-95">
                   Login Now
                </Link>
             </div>
          </div>
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <section className="pt-40 pb-20 bg-[#020617] text-white overflow-hidden relative border-b-4 border-[#ffc800]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ffc800]/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="container mx-auto px-6 relative z-10">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-8 h-[2px] bg-[#ffc800]"></div>
                   <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ffc800]">User Dashboard</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
                  MY <span className="text-[#ffc800]">BOOKINGS</span>
                </h1>
              </div>
              <div className="flex items-center gap-6 bg-white/5 border border-white/10 px-8 py-6 backdrop-blur-xl">
                 <div>
                    <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Active Fleet</p>
                    <p className="text-2xl font-black text-white italic">{bookings.length} <span className="text-[#ffc800]">RIDES</span></p>
                 </div>
                 <div className="w-px h-10 bg-white/10"></div>
                 <History className="w-6 h-6 text-[#ffc800]" />
              </div>
           </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white border-2 border-slate-900 -skew-x-1 shadow-xl">
                <Loader2 className="w-12 h-12 text-[#ffc800] animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Syncing Booking Data...</p>
             </div>
          ) : bookings.length === 0 ? (
             <div className="max-w-4xl mx-auto">
                <div className="bg-white border-2 border-slate-900 p-20 text-center relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 -skew-x-12 translate-x-16 -translate-y-16"></div>
                   <BikeIcon className="w-16 h-16 text-slate-200 mx-auto mb-8" />
                   <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-4">No Active Rides Found</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10 max-w-sm mx-auto">Unlock freedom by choosing your next machine from our elite fleet.</p>
                   <Link href="/rent-bikes" className="inline-flex items-center gap-3 bg-[#ffc800] text-black px-12 py-4 font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-[#ffc800] transition-all">
                      Browse Fleet
                      <ChevronRight className="w-4 h-4" />
                   </Link>
                </div>
             </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {bookings.map((booking) => (
                <div key={booking.bookingId} className="group relative">
                  {/* Skewed Shadow Layer */}
                  <div className="absolute inset-0 -skew-x-2 bg-slate-900/5 translate-y-2 translate-x-2 transition-transform group-hover:translate-y-3 group-hover:translate-x-3 duration-500" />
                  
                  {/* Card Container */}
                  <div className="relative bg-white border-2 border-slate-900 p-8 -skew-x-2 hover:border-[#ffc800] transition-all duration-500 overflow-hidden">
                    <div className="skew-x-2">
                       {/* Header */}
                       <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100">
                          <div>
                             <div className="flex items-center gap-3 mb-2">
                                <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-1 rounded-sm uppercase tracking-widest">{booking.status}</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{booking.bookingId}</span>
                             </div>
                             <h3 className="text-2xl font-black uppercase tracking-tighter italic text-slate-900 group-hover:text-[#ffc800] transition-colors">{booking.bike.name}</h3>
                          </div>
                          <div className="text-right">
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Paid</p>
                             <p className="text-2xl font-black text-slate-900 italic">₹{booking.totalPrice}</p>
                          </div>
                       </div>

                       {/* Data Grid */}
                       <div className="grid grid-cols-2 gap-8 mb-10">
                          <div className="space-y-4">
                             <div className="flex items-center gap-4 group/item">
                                <div className="w-8 h-8 bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-[#ffc800]/10 group-hover/item:text-[#ffc800] transition-colors">
                                   <Calendar className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Pickup Schedule</p>
                                   <p className="text-[11px] font-black text-slate-900 uppercase">{booking.pickupDate} @ {booking.pickupTime}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4 group/item">
                                <div className="w-8 h-8 bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-[#ffc800]/10 group-hover/item:text-[#ffc800] transition-colors">
                                   <MapPin className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Station</p>
                                   <p className="text-[11px] font-black text-slate-900 uppercase">Kanpur Main Hub</p>
                                </div>
                             </div>
                          </div>
                          <div className="space-y-4">
                             <div className="flex items-center gap-4 group/item">
                                <div className="w-8 h-8 bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-[#ffc800]/10 group-hover/item:text-[#ffc800] transition-colors">
                                   <Clock className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Duration</p>
                                   <p className="text-[11px] font-black text-slate-900 uppercase">{booking.duration} Action Days</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4 group/item">
                                <div className="w-8 h-8 bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-[#ffc800]/10 group-hover/item:text-[#ffc800] transition-colors">
                                   <Package className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Vehicle No.</p>
                                   <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{booking.bike.vehicleNumber || "PENDING"}</p>
                                </div>
                             </div>
                          </div>
                       </div>

                       {/* Action Footer */}
                       <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                          <div className="flex items-center gap-2">
                             <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Booking Confirmed</span>
                          </div>
                          <button 
                            onClick={() => window.print()}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:text-[#ffc800] transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Print Receipt
                          </button>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
