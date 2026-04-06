import React from "react";

interface BookingReceiptProps {
  bookingId: string;
  date: string;
  user: {
    name: string;
    email: string;
  };
  bike: {
    name: string;
    category: string;
    pricePerDay?: number;
  };
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  duration: number;
  subtotal?: number;
  discount?: number;
  tax?: number;
  total: number;
  location?: string;
}

const BookingReceipt: React.FC<BookingReceiptProps> = ({
  bookingId,
  date,
  user,
  bike,
  pickupDate,
  pickupTime,
  dropoffDate,
  dropoffTime,
  duration,
  subtotal,
  discount,
  tax,
  total,
  location = "Kanpur, India"
}) => {
  // If values are not provided, we try to estimate them or show defaults
  // Assuming 18% GST and some discount if totalPrice < subtotal
  const displayPricePerDay = bike.pricePerDay || Math.round((subtotal || total) / (duration || 1));
  const displaySubtotal = subtotal || (displayPricePerDay * duration);
  const displayTax = tax || Math.round((total / 1.18) * 0.18);
  const displayDiscount = discount || (displaySubtotal + displayTax - total);

  return (
    <div className="bg-white p-8 max-w-[800px] mx-auto border border-slate-900 font-sans text-slate-900 print:p-4 print:border-none">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight leading-none uppercase">
            <span className="text-slate-400">HIMALAYAN</span>{" "}
            <span className="text-[#ffc800] italic">RIDER</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase mt-1">
            Ride Your Freedom
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-[#ffc800] text-[11px] font-black uppercase tracking-[0.2em] mb-1">
            Booking Receipt
          </h2>
          <p className="text-slate-600 text-lg font-black tracking-tight leading-none">
            {bookingId}
          </p>
          <p className="text-slate-300 text-[10px] font-bold mt-1">
            {date}
          </p>
        </div>
      </div>

      {/* Yellow Separator */}
      <div className="h-1.5 bg-[#ffc800] w-full mb-8" />

      {/* Info Table */}
      <div className="border border-slate-100 mb-10 overflow-hidden">
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="w-1/3 bg-slate-50 p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100">
                Vehicle
              </td>
              <td className="p-4 text-sm font-black text-slate-900 uppercase italic">
                {bike.name} ({bike.category})
              </td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="bg-slate-50 p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100">
                Rider
              </td>
              <td className="p-4 text-sm font-bold text-slate-900">
                {user.name} • {user.email}
              </td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="bg-slate-50 p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100">
                Pickup
              </td>
              <td className="p-4 text-sm font-bold text-slate-900">
                {pickupDate} at {pickupTime}
              </td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="bg-slate-50 p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100">
                Drop Off
              </td>
              <td className="p-4 text-sm font-bold text-slate-900">
                {dropoffDate} at {dropoffTime}
              </td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="bg-slate-50 p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100">
                Duration
              </td>
              <td className="p-4 text-sm font-bold text-slate-900 uppercase">
                {duration} Days
              </td>
            </tr>
            <tr>
              <td className="bg-slate-50 p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-100">
                Location
              </td>
              <td className="p-4 text-sm font-bold text-slate-900">
                {location}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Billing Section */}
      <div className="mb-12">
        <div className="flex justify-between px-4 py-2 mb-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Description</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</span>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-4 border-y border-slate-100 px-4">
            <span className="text-sm font-medium text-slate-600">Rental ({duration} day × ₹{displayPricePerDay})</span>
            <span className="text-sm font-black text-slate-900">₹{displaySubtotal}</span>
          </div>
          
          {displayDiscount > 0 && (
            <div className="flex justify-between items-center py-2 px-4">
              <span className="text-sm font-bold text-emerald-600 italic">Reward Discount</span>
              <span className="text-sm font-black text-emerald-600">- ₹{displayDiscount}</span>
            </div>
          )}

          <div className="flex justify-between items-center py-2 px-4">
            <span className="text-sm font-medium text-slate-600">GST (18%)</span>
            <span className="text-sm font-black text-slate-900">₹{displayTax}</span>
          </div>

          <div className="flex justify-between items-center pt-8 px-4 border-t-2 border-slate-100">
            <span className="text-lg font-black text-[#ffc800] uppercase tracking-wider">Total Payable</span>
            <span className="text-4xl font-black text-slate-300 italic">₹{total}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-8 border-t border-slate-100 flex flex-wrap justify-center gap-x-8 gap-y-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
        <span>support@himalayanrider.in</span>
        <span className="hidden md:inline">•</span>
        <span>+91 9127008800</span>
        <span className="hidden md:inline">•</span>
        <span>Kanpur, India</span>
      </div>
    </div>
  );
};

export default BookingReceipt;
