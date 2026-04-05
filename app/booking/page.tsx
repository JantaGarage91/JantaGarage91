"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bike,
  Calendar,
  Clock,
  MapPin,
  User,
  Download,
  ArrowLeft,
  Zap,
  ShieldCheck,
  Star,
  Phone,
  Mail,
  FileText,
  Edit3,
  Save,
  X,
  Receipt,
  CheckCircle2,
  Gift,
  Loader2,
  AlertTriangle
} from "lucide-react";

export default function BookingPage() {
  const router = useRouter();
  const receiptRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<any>(null);
  const [booking, setBooking] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    pickupDate: "",
    pickupTime: "",
    dropoffDate: "",
    dropoffTime: "",
  });

  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Coupon States
  const [applyCoupon, setApplyCoupon] = useState(false);
  const [bestCoupon, setBestCoupon] = useState<any>(null);
  const [isFetchingCoupon, setIsFetchingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");

  const [bookingId] = useState(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "HR-";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result + "-" + Date.now().toString().slice(-4);
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedBooking = localStorage.getItem("pendingBooking");

    if (!storedUser) {
      router.push("/auth/user");
      return;
    }
    if (!storedBooking) {
      router.push("/rent-bikes");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    const parsedBooking = JSON.parse(storedBooking);
    setUser(parsedUser);
    setBooking(parsedBooking);
    setEditForm({
      pickupDate: parsedBooking.bookingForm.pickupDate,
      pickupTime: parsedBooking.bookingForm.pickupTime,
      dropoffDate: parsedBooking.bookingForm.dropoffDate,
      dropoffTime: parsedBooking.bookingForm.dropoffTime,
    });
  }, []);

  // Fetch best coupon logic
  useEffect(() => {
    const fetchBest = async () => {
      if (applyCoupon && !bestCoupon) {
        setIsFetchingCoupon(true);
        setCouponError("");
        try {
          const res = await fetch("/api/coupons/active-best");
          const data = await res.json();
          if (res.ok) {
            setBestCoupon(data);
          } else {
            setApplyCoupon(false);
            setCouponError(data.message || "Discovery failure");
          }
        } catch (err) {
          setApplyCoupon(false);
          setCouponError("Network sync failure");
        } finally {
          setIsFetchingCoupon(false);
        }
      }
    };
    fetchBest();
  }, [applyCoupon, bestCoupon]);

  if (!booking || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-[#ffc800] rounded-full animate-spin"></div>
      </div>
    );
  }

  const { bike } = booking;
  const form = editForm;

  const getDays = () => {
    const pickup = new Date(editForm.pickupDate || booking.bookingForm.pickupDate);
    const dropoff = new Date(editForm.dropoffDate || booking.bookingForm.dropoffDate);
    if (!pickup.getTime() || !dropoff.getTime()) return 1;
    const diff = Math.ceil((dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const days = getDays();
  const pricePerDay = bike?.pricePerDay || 0;
  const subtotal = pricePerDay * days;
  
  // Calculate Discount
  const discountAmount = (applyCoupon && bestCoupon) 
    ? Math.round((subtotal * bestCoupon.discountPercent) / 100) 
    : 0;

  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxRate = 0.18;
  const tax = Math.round(subtotalAfterDiscount * taxRate);
  const total = subtotalAfterDiscount + tax;

  const handleSaveEdit = () => {
    if (booking) {
      const updated = {
        ...booking,
        bookingForm: {
          ...booking.bookingForm,
          ...editForm,
        },
      };
      setBooking(updated);
      localStorage.setItem("pendingBooking", JSON.stringify(updated));
    }
    setIsEditing(false);
  };

  const handleConfirmAndDownload = async () => {
    if (isConfirming || isConfirmed) return;
    setIsConfirming(true);

    try {
      const payload = {
        bookingId,
        user: { name: user.name, email: user.email },
        bike: { 
          bikeId: bike._id || bike.id, 
          name: bike.name, 
          vehicleNumber: bike.vehicleNumber || "NOT_SPECIFIED" 
        },
        pickupDate: form.pickupDate,
        pickupTime: form.pickupTime,
        dropoffDate: form.dropoffDate,
        dropoffTime: form.dropoffTime,
        duration: days,
        totalPrice: total,
        status: "CONFIRMED"
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        // Trigger Print/Download
        const printContent = receiptRef.current;
        if (printContent) {
          const receiptHtml = printContent.innerHTML;
          
          const printWindow = window.open("", "_blank", "width=800,height=900");
          if (printWindow) {
            printWindow.document.write(`
              <!DOCTYPE html>
              <html>
                <head>
                  <title>Himalayan Rider Receipt - ${bookingId}</title>
                  <style>
                    * { box-sizing: border-box; }
                    body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #fff; }
                    @media print {
                      body { padding: 0; }
                      @page { margin: 0.5cm; }
                    }
                  </style>
                </head>
                <body>
                  ${receiptHtml}
                  <script>
                    window.onload = () => {
                      setTimeout(() => {
                        window.print();
                        window.close();
                      }, 500);
                    };
                  </script>
                </body>
              </html>
            `);
            printWindow.document.close();
          }
        }
        
        setIsConfirmed(true);
        localStorage.removeItem("pendingBooking");
        
        setTimeout(() => {
          window.location.href = "/";
        }, 5000);
      } else {
        const errorData = await res.json();
        alert(`Failed to confirm: ${errorData.error || "Please check your inputs"}`);
      }
    } catch (err: any) {
      alert(`Connectivity error: ${err.message}`);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-printable, #receipt-printable * { visibility: visible; }
          #receipt-printable { position: fixed; top: 0; left: 0; width: 100%; padding: 40px; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Hero Header */}
      <section className="pt-36 pb-16 bg-[#020617] text-white border-b-4 border-[#ffc800] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#ffc800]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="container mx-auto px-6 relative z-10">
          <Link href="/rent-bikes" className="no-print inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/50 hover:text-[#ffc800] transition-colors mb-8 border border-white/10 hover:border-[#ffc800] px-4 py-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Fleet
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-[#ffc800] border-b-2 border-[#ffc800] pb-1">Booking Confirmation</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
            YOUR <span className="text-[#ffc800]">RECEIPT</span>
          </h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em] mt-3">
            Booking ID: <span className="text-[#ffc800]">{bookingId}</span>
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT: Vehicle + Schedule */}
            <div className="lg:col-span-2 space-y-6">

              {/* Vehicle Card */}
              <div className="bg-white border-2 border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-[#020617] border-b-2 border-[#ffc800] flex items-center gap-3">
                  <Bike className="w-4 h-4 text-[#ffc800]" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Selected Vehicle</h2>
                </div>
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 h-48 overflow-hidden shrink-0 border-r-2 border-slate-200">
                    <img
                      src={bike.image}
                      alt={bike.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="bg-[#ffc800] text-black px-3 py-1 text-[8px] font-black uppercase tracking-widest">
                          {bike.category}
                        </span>
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 italic mt-2">{bike.name}</h3>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-50 border-2 border-slate-200 px-3 py-2">
                        <Star className="w-3.5 h-3.5 text-[#ffc800] fill-[#ffc800]" />
                        <span className="text-[11px] font-black text-slate-900">4.9</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 border border-slate-100 bg-slate-50">
                        <Zap className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Engine</p>
                          <p className="text-[11px] font-black text-slate-900">{bike.cc} CC</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 border border-slate-100 bg-slate-50">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Coverage</p>
                          <p className="text-[11px] font-black text-slate-900">Full Insurance</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 border border-slate-100 bg-slate-50">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Pickup</p>
                          <p className="text-[11px] font-black text-slate-900">Kanpur, India</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 border border-slate-100 bg-slate-50">
                        <Receipt className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Rate</p>
                          <p className="text-[11px] font-black text-slate-900">₹{bike.pricePerDay}/day</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule Card */}
              <div className="bg-white border-2 border-slate-200">
                <div className="px-6 py-4 bg-[#020617] border-b-2 border-[#ffc800] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[#ffc800]" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Booking Schedule</h2>
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="no-print flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white hover:text-black transition-all border border-[#ffc800] bg-[#ffc800]/10 hover:bg-[#ffc800] px-3 py-1.5"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2 no-print">
                      <button
                        onClick={handleSaveEdit}
                        className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-black bg-[#ffc800] border border-[#ffc800] px-3 py-1.5 hover:bg-white transition-all"
                      >
                        <Save className="w-3 h-3" />Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white/60 border border-white/20 px-3 py-1.5 hover:border-white/50 transition-all"
                      >
                        <X className="w-3 h-3" />Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pickup Date */}
                  <div className="border-2 border-slate-200 p-4">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-[#ffc800]" /> Pickup Date
                    </p>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editForm.pickupDate}
                        onChange={(e) => setEditForm({ ...editForm, pickupDate: e.target.value })}
                        className="w-full text-sm font-black text-slate-900 outline-none border-b-2 border-[#ffc800] bg-transparent pb-1"
                      />
                    ) : (
                      <p className="text-sm font-black text-slate-900">{form.pickupDate || "—"}</p>
                    )}
                  </div>
                  {/* Pickup Time */}
                  <div className="border-2 border-slate-200 p-4">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#ffc800]" /> Pickup Time
                    </p>
                    {isEditing ? (
                      <select
                        value={editForm.pickupTime}
                        onChange={(e) => setEditForm({ ...editForm, pickupTime: e.target.value })}
                        className="w-full text-sm font-black text-slate-900 outline-none border-b-2 border-[#ffc800] bg-transparent pb-1"
                      >
                        <option>09:00 AM</option>
                        <option>11:00 AM</option>
                        <option>02:00 PM</option>
                        <option>06:00 PM</option>
                      </select>
                    ) : (
                      <p className="text-sm font-black text-slate-900">{form.pickupTime || "—"}</p>
                    )}
                  </div>
                  {/* Dropoff Date */}
                  <div className="border-2 border-slate-200 p-4">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-rose-500" /> Drop Off Date
                    </p>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editForm.dropoffDate}
                        onChange={(e) => setEditForm({ ...editForm, dropoffDate: e.target.value })}
                        className="w-full text-sm font-black text-slate-900 outline-none border-b-2 border-[#ffc800] bg-transparent pb-1"
                      />
                    ) : (
                      <p className="text-sm font-black text-slate-900">{form.dropoffDate || "—"}</p>
                    )}
                  </div>
                  {/* Dropoff Time */}
                  <div className="border-2 border-slate-200 p-4">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-rose-500" /> Drop Off Time
                    </p>
                    {isEditing ? (
                      <select
                        value={editForm.dropoffTime}
                        onChange={(e) => setEditForm({ ...editForm, dropoffTime: e.target.value })}
                        className="w-full text-sm font-black text-slate-900 outline-none border-b-2 border-[#ffc800] bg-transparent pb-1"
                      >
                        <option>09:00 AM</option>
                        <option>11:00 AM</option>
                        <option>02:00 PM</option>
                        <option>06:00 PM</option>
                      </select>
                    ) : (
                      <p className="text-sm font-black text-slate-900">{form.dropoffTime || "—"}</p>
                    )}
                  </div>
                </div>

                <div className="mx-6 mb-6 p-4 bg-[#ffc800]/10 border-2 border-[#ffc800]/40 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#ffc800] shrink-0" />
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-wider">
                    Total Duration: <span className="text-[#020617]">{days} Day{days !== 1 ? "s" : ""}</span>
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white border-2 border-slate-200">
                <div className="px-6 py-4 bg-[#020617] border-b-2 border-[#ffc800] flex items-center gap-3">
                  <User className="w-4 h-4 text-[#ffc800]" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Rider Details</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border-2 border-slate-200 p-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#ffc800] flex items-center justify-center text-black font-black text-sm shrink-0">
                      {user.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Name</p>
                      <p className="text-[11px] font-black text-slate-900 mt-0.5">{user.name}</p>
                    </div>
                  </div>
                  <div className="border-2 border-slate-200 p-4 flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#ffc800] shrink-0" />
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                      <p className="text-[11px] font-black text-slate-900 mt-0.5 break-all">{user.email}</p>
                    </div>
                  </div>
                  <div className="border-2 border-slate-200 p-4 flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#ffc800] shrink-0" />
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Support</p>
                      <p className="text-[11px] font-black text-slate-900 mt-0.5">+91 9127008800</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Bill Summary */}
            <div className="space-y-6">
              <div className="bg-white border-[3px] border-slate-900 shadow-[10px_20px_40px_rgba(0,0,0,0.08)] sticky top-24 overflow-hidden rounded-lg">
                <div className="px-5 py-3.5 bg-[#020617] border-b-[3px] border-[#ffc800] flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#ffc800]" />
                  <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Payment Matrix</h2>
                </div>

                <div className="p-5 space-y-3.5">
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                    <span className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-400">Machine</span>
                    <span className="text-[11px] font-black text-slate-900 italic uppercase tracking-tighter">{bike.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                    <span className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-400">Daily Rate</span>
                    <span className="text-[11px] font-black text-slate-900">₹{pricePerDay}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                    <span className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-400">Duration</span>
                    <span className="text-[11px] font-black text-slate-900">{days} Day{days !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100 bg-slate-50/50 -mx-5 px-5">
                    <span className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-400">Subtotal</span>
                    <span className="text-[11px] font-black text-slate-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                    <span className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-400">GST (18%)</span>
                    <span className="text-[11px] font-black text-slate-900">₹{tax}</span>
                  </div>
                  <div className="mt-5 pt-5 border-t-[3px] border-[#ffc800] bg-slate-900 -mx-5 px-5 pb-5">
                      {/* NEW: Coupon Logic */}
                      <div className="mb-6 space-y-4">
                         <button
                            onClick={() => setApplyCoupon(!applyCoupon)}
                            className={`w-full p-4 border-2 transition-all flex items-center justify-between group ${
                              applyCoupon 
                                ? "bg-emerald-500/10 border-emerald-500" 
                                : "bg-white/5 border-white/10 hover:border-white/30"
                            }`}
                         >
                            <div className="flex items-center gap-3">
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                 applyCoupon ? "bg-emerald-500 text-black" : "bg-slate-800 text-slate-500"
                               }`}>
                                  {isFetchingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}
                               </div>
                               <div className="text-left">
                                  <p className={`text-[9px] font-black uppercase tracking-widest leading-none mb-1 ${applyCoupon ? "text-emerald-500" : "text-white"}`}>
                                     {applyCoupon ? "Reward Active" : "Apply Best Offer"}
                                  </p>
                                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">
                                     {applyCoupon && bestCoupon 
                                        ? `Code: ${bestCoupon.code} Applied` 
                                        : isFetchingCoupon 
                                           ? "Scanning network..." 
                                           : "Scan for highest discount"}
                                  </p>
                               </div>
                            </div>
                            <div className={`w-5 h-5 border-2 rounded shrink-0 flex items-center justify-center ${
                              applyCoupon ? "bg-emerald-500 border-emerald-500" : "border-white/20"
                            }`}>
                               {applyCoupon && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                            </div>
                         </button>

                         {couponError && (
                            <div className="bg-red-500/5 border border-red-500/20 p-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                               <AlertTriangle className="w-3 h-3 text-red-500" />
                               <span className="text-[8px] font-black uppercase text-red-500 tracking-widest">
                                  {couponError === "No active coupons found" ? "no active coupon available yet" : couponError}
                               </span>
                            </div>
                         )}

                         {applyCoupon && bestCoupon && (
                            <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
                               <span className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">SAVINGS UNLOCKED ({bestCoupon.discountPercent}%)</span>
                               <span className="text-[10px] font-black text-emerald-400 italic font-sans">- ₹{discountAmount}</span>
                            </div>
                         )}
                      </div>

                    <div className="flex justify-between items-center mb-5">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ffc800]">Final Amount</span>
                      <span className="text-2xl font-black text-white italic tracking-tighter">₹{total}</span>
                    </div>

                    <div 
                      className={`flex items-start gap-3 p-3 transition-all group cursor-pointer mb-5 border-2 ${agreedToTerms ? "bg-[#ffc800]/10 border-[#ffc800]" : "bg-white/5 border-white/10 hover:border-white/30"}`} 
                      onClick={() => setAgreedToTerms(!agreedToTerms)}
                    >
                      <div className={`w-4 h-4 border-2 transition-all shrink-0 flex items-center justify-center mt-0.5 ${agreedToTerms ? "bg-[#ffc800] border-[#ffc800]" : "border-white/30"}`}>
                        {agreedToTerms && <CheckCircle2 className="w-3 h-3 text-black font-bold" />}
                      </div>
                      <p className={`text-[8px] font-black uppercase tracking-widest leading-relaxed transition-colors ${agreedToTerms ? "text-white" : "text-white/40 group-hover:text-white/60"}`}>
                        Agree to <span className="text-[#ffc800]">Terms</span>, ID & Fuel Policy
                      </p>
                    </div>

                    <button
                      onClick={handleConfirmAndDownload}
                      disabled={isConfirming || isConfirmed || !agreedToTerms}
                      className={`no-print w-full h-14 font-black text-[10px] uppercase tracking-[0.15em] transition-all border-2 active:scale-95 flex items-center justify-center gap-2.5 relative ${
                        isConfirmed 
                        ? "bg-emerald-500 text-white border-emerald-500" 
                        : !agreedToTerms
                          ? "bg-transparent text-white/10 border-white/5 cursor-not-allowed"
                          : "bg-[#ffc800] text-black border-[#ffc800] hover:bg-white hover:border-white hover:text-black shadow-lg shadow-yellow-500/10"
                      }`}
                    >
                      {isConfirming ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      ) : isConfirmed ? (
                        <div className="flex items-center gap-2">
                           <CheckCircle2 className="w-4 h-4" />
                           <span>Downloaded</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                           <Zap className="w-4 h-4" />
                           <span>Confirm Booking</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
      </section>

      {/* Hidden printable receipt */}
      <div id="receipt-printable" ref={receiptRef} style={{ display: "none" }}>
        <div style={{ fontFamily: "Arial, sans-serif", padding: "40px", maxWidth: "700px", margin: "0 auto", border: "2px solid #020617" }}>
          <div style={{ background: "#020617", color: "white", padding: "24px", marginBottom: "24px", borderBottom: "4px solid #ffc800" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "22px", fontWeight: "900", fontStyle: "italic", letterSpacing: "-0.05em", textTransform: "uppercase" }}>
                  HIMALAYAN <span style={{ color: "#ffc800" }}>RIDER</span>
                </div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.3em", marginTop: "2px" }}>
                  Ride Your Freedom
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "10px", color: "#ffc800", textTransform: "uppercase", letterSpacing: "0.2em" }}>Booking Receipt</div>
                <div style={{ fontSize: "14px", fontWeight: "900", color: "white", marginTop: "4px" }}>{bookingId}</div>
                <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{new Date().toLocaleDateString("en-IN")}</div>
              </div>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "24px" }}>
            <tbody>
              <tr style={{ background: "#f8fafc" }}>
                <td style={{ padding: "10px 12px", fontWeight: "900", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748b", border: "1px solid #e2e8f0" }}>Vehicle</td>
                <td style={{ padding: "10px 12px", fontWeight: "900", fontSize: "13px", fontStyle: "italic", color: "#020617", border: "1px solid #e2e8f0" }}>{bike.name} ({bike.category})</td>
              </tr>
              <tr>
                <td style={{ padding: "10px 12px", fontWeight: "900", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748b", border: "1px solid #e2e8f0" }}>Rider</td>
                <td style={{ padding: "10px 12px", fontWeight: "700", fontSize: "12px", color: "#020617", border: "1px solid #e2e8f0" }}>{user.name} • {user.email}</td>
              </tr>
              <tr style={{ background: "#f8fafc" }}>
                <td style={{ padding: "10px 12px", fontWeight: "900", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748b", border: "1px solid #e2e8f0" }}>Pickup</td>
                <td style={{ padding: "10px 12px", fontWeight: "700", fontSize: "12px", color: "#020617", border: "1px solid #e2e8f0" }}>{form.pickupDate} at {form.pickupTime}</td>
              </tr>
              <tr>
                <td style={{ padding: "10px 12px", fontWeight: "900", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748b", border: "1px solid #e2e8f0" }}>Drop Off</td>
                <td style={{ padding: "10px 12px", fontWeight: "700", fontSize: "12px", color: "#020617", border: "1px solid #e2e8f0" }}>{form.dropoffDate} at {form.dropoffTime}</td>
              </tr>
              <tr style={{ background: "#f8fafc" }}>
                <td style={{ padding: "10px 12px", fontWeight: "900", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748b", border: "1px solid #e2e8f0" }}>Duration</td>
                <td style={{ padding: "10px 12px", fontWeight: "700", fontSize: "12px", color: "#020617", border: "1px solid #e2e8f0" }}>{days} Day{days !== 1 ? "s" : ""}</td>
              </tr>
              <tr>
                <td style={{ padding: "10px 12px", fontWeight: "900", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748b", border: "1px solid #e2e8f0" }}>Location</td>
                <td style={{ padding: "10px 12px", fontWeight: "700", fontSize: "12px", color: "#020617", border: "1px solid #e2e8f0" }}>Kanpur, India</td>
              </tr>
            </tbody>
          </table>

          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "8px" }}>
            <thead>
              <tr style={{ background: "#020617", color: "white" }}>
                <th style={{ padding: "10px 12px", fontWeight: "900", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", textAlign: "left" }}>Description</th>
                <th style={{ padding: "10px 12px", fontWeight: "900", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: "10px 12px", border: "1px solid #e2e8f0", fontSize: "11px", color: "#020617" }}>Rental ({days} day × ₹{pricePerDay})</td><td style={{ padding: "10px 12px", border: "1px solid #e2e8f0", fontSize: "11px", fontWeight: "700", color: "#020617", textAlign: "right" }}>₹{subtotal}</td></tr>
              
              {applyCoupon && bestCoupon && (
                <tr style={{ background: "#f0fdf4" }}>
                  <td style={{ padding: "10px 12px", border: "1px solid #e2e8f0", fontSize: "11px", color: "#166534", fontWeight: "700" }}>Reward Discount ({bestCoupon.discountPercent}%)</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #e2e8f0", fontSize: "11px", fontWeight: "700", color: "#166534", textAlign: "right" }}>- ₹{discountAmount}</td>
                </tr>
              )}

              <tr style={{ background: "#f8fafc" }}><td style={{ padding: "10px 12px", border: "1px solid #e2e8f0", fontSize: "11px", color: "#020617" }}>GST (18%)</td><td style={{ padding: "10px 12px", border: "1px solid #e2e8f0", fontSize: "11px", fontWeight: "700", color: "#020617", textAlign: "right" }}>₹{tax}</td></tr>
              <tr style={{ background: "#020617" }}>
                <td style={{ padding: "14px 12px", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", color: "#ffc800" }}>TOTAL PAYABLE</td>
                <td style={{ padding: "14px 12px", fontSize: "18px", fontWeight: "900", fontStyle: "italic", color: "white", textAlign: "right" }}>₹{total}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: "32px", paddingTop: "16px", borderTop: "2px solid #e2e8f0", display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.2em" }}>
            <span>support@himalayanrider.in</span>
            <span>+91 9127008800</span>
            <span>Kanpur, India</span>
          </div>
        </div>
      </div>
    </div>
  );
}
