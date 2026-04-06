"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Search, 
  Filter, 
  Bike as BikeIcon, 
  ShieldCheck, 
  MapPin, 
  Star, 
  Zap, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  Calendar,
  ChevronRight,
  Lock,
  ArrowRight
} from "lucide-react";
import AuthModal from "@/components/AuthModal";
import KYCModal from "@/components/KYCModal";

export default function RentBikesPage() {
  const [user, setUser] = useState<any>(null);
  const [bikes, setBikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const router = useRouter();

  const [bookingForm, setBookingForm] = useState({
    pickupDate: "",
    pickupTime: "",
    dropoffDate: "",
    dropoffTime: "",
    city: "Kanpur"
  });

  const [step, setStep] = useState(1);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setUser(null);
    } else {
      setUser(JSON.parse(storedUser));
    }
    
    // Check if coming from hero section
    const heroForm = localStorage.getItem("heroBookingForm");
    if (heroForm) {
      setBookingForm(JSON.parse(heroForm));
      setStep(2);
      localStorage.removeItem("heroBookingForm"); // Cleanup
    }

    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bikes");
      const data = await res.json();
      if (res.ok) setBikes(data);
    } catch (err: any) {
      setError("Failed to synchronize with fleet database.");
    } finally {
      setLoading(false);
    }
  };

  const handleAuthGuard = (e?: any) => {
    if (!user) {
      if (e) e.preventDefault();
      setIsAuthModalOpen(true);
      return false;
    }
    if (!user.aadhaarUrl || !user.dlUrl) {
      if (e) e.preventDefault();
      setIsKYCModalOpen(true);
      return false;
    }
    return true;
  };

  const handleFieldInteraction = (e: React.MouseEvent | React.FocusEvent) => {
    if (!handleAuthGuard()) {
      (e.target as HTMLElement).blur?.();
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleAuthGuard()) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookNow = (bike: any) => {
    if (!handleAuthGuard()) return;
    localStorage.setItem("pendingBooking", JSON.stringify({ bike, bookingForm }));
    router.push("/booking");
  };

  const categories = ["All", "BIKE", "SCOOTY"];
  
  const getRequestedDateRange = () => {
    if (!bookingForm.pickupDate || !bookingForm.dropoffDate) return [];
    
    const start = new Date(bookingForm.pickupDate);
    const end = new Date(bookingForm.dropoffDate);
    const range: string[] = [];
    
    let curr = new Date(start);
    while (curr <= end) {
      range.push(curr.toISOString().split('T')[0]);
      curr.setDate(curr.getDate() + 1);
    }
    return range;
  };

  const checkAvailability = (bike: any) => {
    // If vehicle is in maintenance, always unavailable
    if (bike.status === "MAINTENANCE") return false;
    
    const requestedRange = getRequestedDateRange();
    const blockedDates = bike.unavailableDates || [];
    
    // Check for any intersection
    const isBlocked = requestedRange.some(date => blockedDates.includes(date));
    return !isBlocked;
  };

  const displayBikes = (bikes || [])
    .filter(b => b.isActive !== false)
    .filter(b => filter === "All" || b.category === filter)
    .filter(b => showOnlyAvailable ? checkAvailability(b) : true);

  return (
    <div className="min-h-screen bg-slate-50">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(userData) => setUser(userData)}
      />

      <KYCModal 
        isOpen={isKYCModalOpen} 
        onClose={() => setIsKYCModalOpen(false)} 
      />

      {/* Hero Section */}
      <section className="pt-48 pb-32 bg-[#020617] text-white overflow-hidden relative border-b-4 border-[#ffc800]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ffc800]/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ffc800]/20 to-transparent"></div>

        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute h-px bg-white" style={{
              width: `${20 + i * 15}%`,
              left: '-10%',
              top: `${20 + i * 15}%`,
              transform: 'rotate(-45deg)',
              opacity: 0.1 + i * 0.05
            }}></div>
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-0">
            <div className="flex items-center justify-center gap-6 mb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ffc800] border-b-2 border-[#ffc800] pb-1">Operational Step 01</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-none">
              PLAN YOUR <span className="text-[#ffc800]">JOURNEY</span>
            </h1>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.3em] max-w-2xl mx-auto leading-relaxed">
              Configure your timeline to synchronize with our elite machine network.
            </p>
          </div>
        </div>
      </section>

      <section className="pt-20 pb-24 relative z-20 bg-slate-50">
        <div className="container mx-auto px-6">

          {/* STEP 1: SCHEDULING FORM */}
          {step === 1 && (
            <div className="max-w-7xl mx-auto">
              <div className="relative animate-in fade-in slide-in-from-bottom-12 duration-1000">
                <div className="absolute inset-0 -skew-x-3 bg-white border-[4px] border-slate-900 shadow-[20px_40px_100px_rgba(0,0,0,0.15)] overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#1e293b_2px,transparent_2px)] [background-size:32px_32px]"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffc800]/10 -skew-x-12 translate-x-16 -translate-y-16"></div>
                </div>

                <div className="relative z-10 p-12 md:p-20">
                  <form onSubmit={handleNextStep} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 items-end">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4">Pick Up Date</label>
                      <div className="relative md:-skew-x-12 bg-white border border-slate-200 hover:border-[#020617] transition-all shadow-sm h-[56px] flex items-center group/field">
                        <div className="md:skew-x-12 flex items-center w-full px-4 md:px-6 gap-3">
                          <Calendar className="w-4 h-4 text-slate-400 group-hover/field:text-[#ffc800]" />
                          <input
                            type="date"
                            required
                            value={bookingForm.pickupDate}
                            onClick={handleFieldInteraction}
                            onFocus={handleFieldInteraction}
                            onChange={(e) => setBookingForm({ ...bookingForm, pickupDate: e.target.value })}
                            className="bg-transparent w-full text-sm font-black text-slate-900 outline-none uppercase cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4">Pick Time</label>
                      <div className="relative md:-skew-x-12 bg-white border border-slate-200 hover:border-[#020617] transition-all shadow-sm h-[56px] flex items-center group/field">
                        <div className="md:skew-x-12 flex items-center w-full px-4 md:px-6 gap-3">
                          <Clock className="w-4 h-4 text-slate-400 group-hover/field:text-[#ffc800]" />
                          <select
                            required
                            value={bookingForm.pickupTime}
                            onClick={handleFieldInteraction}
                            onFocus={handleFieldInteraction}
                            onChange={(e) => setBookingForm({ ...bookingForm, pickupTime: e.target.value })}
                            className="bg-transparent w-full text-sm font-black text-slate-900 outline-none appearance-none cursor-pointer uppercase"
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

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4">Drop Off Date</label>
                      <div className="relative md:-skew-x-12 bg-white border border-slate-200 hover:border-[#020617] transition-all shadow-sm h-[56px] flex items-center group/field">
                        <div className="md:skew-x-12 flex items-center w-full px-4 md:px-6 gap-3">
                          <Calendar className="w-4 h-4 text-slate-400 group-hover/field:text-[#ffc800]" />
                          <input
                            type="date"
                            required
                            value={bookingForm.dropoffDate}
                            onClick={handleFieldInteraction}
                            onFocus={handleFieldInteraction}
                            onChange={(e) => setBookingForm({ ...bookingForm, dropoffDate: e.target.value })}
                            className="bg-transparent w-full text-sm font-black text-slate-900 outline-none uppercase cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4">Drop Time</label>
                      <div className="relative md:-skew-x-12 bg-white border border-slate-200 hover:border-[#020617] transition-all shadow-sm h-[56px] flex items-center group/field">
                        <div className="md:skew-x-12 flex items-center w-full px-4 md:px-6 gap-3">
                          <Clock className="w-4 h-4 text-slate-400 group-hover/field:text-[#ffc800]" />
                          <select
                            required
                            value={bookingForm.dropoffTime}
                            onClick={handleFieldInteraction}
                            onFocus={handleFieldInteraction}
                            onChange={(e) => setBookingForm({ ...bookingForm, dropoffTime: e.target.value })}
                            className="bg-transparent w-full text-sm font-black text-slate-900 outline-none appearance-none cursor-pointer uppercase"
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

                    <div className="pt-6">
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
                        className="relative w-full md:-skew-x-12 h-[56px] bg-[#020617] hover:bg-[#ffc800] group/btn transition-all overflow-hidden shadow-lg shadow-black/20 active:scale-95 border-2 border-[#020617]"
                      >
                        <div className="md:skew-x-12 flex items-center justify-center gap-3">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white group-hover/btn:text-black">Find Bike</span>
                          <ArrowRight className="w-4 h-4 text-[#ffc800] group-hover/btn:text-black group-hover/btn:translate-x-1 transition-all" />
                        </div>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FLEET SELECTION */}
          {step === 2 && (
            <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-700">
              {/* Sidebar */}
              <aside className="w-full lg:w-72 space-y-6 shrink-0">
                <div className="bg-[#020617] text-white p-6 border-2 border-[#ffc800] shadow-xl">
                  <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#ffc800]/30">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffc800]">Schedule Info</h3>
                    <button onClick={() => setStep(1)} className="text-[9px] font-black uppercase tracking-widest text-white hover:text-black transition-all border border-[#ffc800] bg-[#ffc800]/10 hover:bg-[#ffc800] px-3 py-1">
                      Edit
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 border border-white/10 bg-white/5">
                      <div className="w-7 h-7 bg-[#ffc800] flex items-center justify-center text-black shrink-0">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-white/50 uppercase tracking-widest">Duration</p>
                        <p className="text-[11px] font-black text-white mt-0.5">{bookingForm.pickupDate} → {bookingForm.dropoffDate}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 border border-white/10 bg-white/5">
                      <div className="w-7 h-7 bg-[#ffc800] flex items-center justify-center text-black shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-white/50 uppercase tracking-widest">Location</p>
                        <p className="text-[11px] font-black text-white mt-0.5">{bookingForm.city}, India</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-slate-200 bg-white">
                  <div className="px-4 py-3 border-b-2 border-slate-200 bg-slate-50 flex items-center gap-2">
                    <Filter className="w-3" />
                    <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Category</h3>
                  </div>
                  <div className="p-2 space-y-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`w-full text-left px-5 py-3.5 font-black uppercase tracking-[0.2em] text-[10px] transition-all border-2 ${
                          filter === cat
                            ? 'bg-[#020617] text-[#ffc800] border-[#020617]'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-[#020617] hover:text-[#020617]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-2 border-slate-200 bg-white">
                  <div className="px-4 py-3 border-b-2 border-slate-200 bg-slate-50 flex items-center gap-2">
                    <Zap className="w-3" />
                    <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Availability</h3>
                  </div>
                  <div className="p-2 space-y-1.5">
                    {[
                      { label: "See All", value: false },
                      { label: "Available Only", value: true }
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => setShowOnlyAvailable(opt.value)}
                        className={`w-full text-left px-5 py-3.5 font-black uppercase tracking-[0.2em] text-[10px] transition-all border-2 ${
                          showOnlyAvailable === opt.value
                            ? 'bg-[#020617] text-[#ffc800] border-[#020617]'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-[#020617] hover:text-[#020617]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Bike Grid */}
              <div className="flex-1">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white border-l-4 border-[#ffc800] shadow-lg">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-[#ffc800] rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 animate-pulse">Loading Fleet...</p>
                  </div>
                ) : displayBikes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 gap-4 bg-white border-2 border-dashed border-slate-200">
                    <BikeIcon className="w-12 h-12 text-slate-200" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No matching bikes in local network</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {displayBikes.map((bike: any) => (
                      <div key={bike._id} className="bg-white overflow-hidden border-2 border-slate-200 hover:border-[#020617] hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all duration-300 group flex flex-col">
                        <div className="relative h-56 overflow-hidden border-b-2 border-slate-200 group-hover:border-[#020617] transition-colors">
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10"></div>
                          <img
                            src={bike.image}
                            alt={bike.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-4 left-4 z-20">
                            <span className="bg-[#ffc800] text-black px-3 py-1 text-[8px] font-black uppercase tracking-widest border border-black/10">
                              {bike.category}
                            </span>
                          </div>
                          <div className="absolute top-4 right-4 bg-black border border-[#ffc800]/40 px-3 py-1.5 flex items-center gap-1.5 z-20">
                            <Star className="w-3 h-3 text-[#ffc800] fill-[#ffc800]" />
                            <span className="text-[10px] font-black text-white">4.9</span>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 z-20 border-t border-white/10">
                            <h3 className="text-xl font-black uppercase tracking-tighter text-white italic">{bike.name}</h3>
                            <div className="flex gap-3 mt-1">
                              <div className="flex items-center gap-1.5 text-[9px] font-black text-white/80 uppercase tracking-widest">
                                <Zap className="w-3 h-3 text-[#ffc800]" />{bike.cc} CC
                              </div>
                              <div className="flex items-center gap-1.5 text-[9px] font-black text-white/80 uppercase tracking-widest">
                                <ShieldCheck className="w-3 h-3 text-emerald-400" />Insured
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-5 flex items-center justify-between border-t-2 border-slate-100 bg-white">
                          <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Per Day</p>
                            <div className="flex items-baseline gap-1 mt-0.5">
                              <span className="text-2xl font-black text-slate-900 italic">₹{bike.pricePerDay}</span>
                              <span className="text-[10px] font-black text-slate-400 uppercase">/day</span>
                            </div>
                          </div>
                          {checkAvailability(bike) ? (
                            <button
                              onClick={() => handleBookNow(bike)}
                              className="bg-[#020617] text-[#ffc800] px-8 py-4 font-black text-[9px] uppercase tracking-widest hover:bg-[#ffc800] hover:text-black border-2 border-[#020617] hover:border-[#ffc800] transition-all active:scale-95 flex items-center gap-2"
                            >
                              Book Now
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <div className="bg-slate-100 text-slate-400 px-6 py-4 font-black text-[9px] uppercase tracking-widest border-2 border-slate-200 cursor-not-allowed flex items-center gap-2">
                              <Lock className="w-3.5 h-3.5" />
                              {bike.status === "MAINTENANCE" ? "Maintenance" : "Reserved"}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
