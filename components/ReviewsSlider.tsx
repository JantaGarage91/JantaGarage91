"use client";

import { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Arjun Sharma",
    role: "Local Guide",
    initial: "A",
    text: "Absolutely flawless experience. I rented the Royal Enfield for a weekend trip to the outskirts. The bike was in pristine condition, and the zero-deposit policy made the process incredibly smooth.",
    rating: 5,
  },
  {
    id: 2,
    name: "Neha Verma",
    role: "Frequent Rider",
    initial: "N",
    text: "The best rental service in Kanpur, hands down. The app interface is super clean, but what really won me over was the instant refund when I returned the bike an hour early. Top-tier professionalism.",
    rating: 5,
  },
  {
    id: 3,
    name: "Rahul Dixit",
    role: "Touring Enthusiast",
    initial: "R",
    text: "I was skeptical about renting online at first, but Rentrip proved me wrong. The 'No Riding Limits' actually means no limits. Took a KTM RC 200 all the way to Lucknow and back.",
    rating: 5,
  },
  {
    id: 4,
    name: "Priya Singh",
    role: "Daily Commuter",
    initial: "P",
    text: "Rented an Activa for a week while my car was in the shop. Incredible value for money. The scooter was practically brand new and riding through Kanpur traffic was a breeze.",
    rating: 4,
  },
  {
    id: 5,
    name: "Vikram Mehta",
    role: "Weekend Explorer",
    initial: "V",
    text: "What sets them apart is the fleet quality. You don't get battered down bikes like other rentals. They genuinely care about their motorcycles and it shows in the ride quality.",
    rating: 5,
  }
];

export default function ReviewsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Robust auto-shuffle effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 4500); 
    
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section id="reviews-section" className="bg-white py-16 md:py-24 px-6 relative overflow-hidden border-t border-slate-100">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:28px_28px]"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:px-12">
          
          {/* Left Side: Engaging Text & Trust Badges */}
          <div className="flex flex-col items-start space-y-6">
            <span className="text-yellow-600 bg-yellow-50 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-block border border-yellow-200">
              Community Voices
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 leading-[0.9]">
              Millions of  <br /> <span className="text-[#ffc800]">Miles Driven.</span>
            </h2>
            <p className="text-slate-500 text-base md:text-lg font-medium max-w-md pb-4 pt-2">
              We aren&apos;t just renting out bikes; we are fueling adventures. Read what our passionate community of riders has to say about the Rentrip experience.
            </p>
            
            <div className="flex flex-wrap gap-6 pt-4 border-t border-slate-100 w-full">
               <div className="space-y-1">
                 <div className="text-2xl md:text-3xl font-black text-slate-900">4.9/5</div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-[#ffc800]">Average Rating</div>
               </div>
               <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
               <div className="space-y-1">
                 <div className="text-2xl md:text-3xl font-black text-slate-900">10k+</div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-blue-500">Happy Riders</div>
               </div>
               <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
               <div className="space-y-1">
                 <div className="text-2xl md:text-3xl font-black text-slate-900">99%</div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-green-500">Refund Rate</div>
               </div>
            </div>
            
            <div className="flex gap-4 mt-6">
               <button 
                 onClick={handlePrev}
                 className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 hover:bg-slate-50 hover:scale-110 active:scale-95 transition-all text-slate-600 hover:text-black cursor-pointer"
               >
                 <ChevronLeft className="w-6 h-6 pr-1" />
               </button>
               <button 
                 onClick={handleNext}
                 className="w-12 h-12 md:w-14 md:h-14 bg-slate-900 rounded-full flex items-center justify-center shadow-lg border border-slate-800 hover:bg-[#ffc800] hover:text-black active:scale-95 transition-all text-white cursor-pointer"
               >
                 <ChevronRight className="w-6 h-6 pl-1" />
               </button>
            </div>
          </div>

          {/* Right Side: The Shuffling Deck */}
          <div className="relative w-full h-[380px] md:h-[450px] flex items-center justify-center lg:justify-end">
             <div className="relative w-full max-w-[450px] h-[340px] md:h-[380px]">
               {reviews.map((review, index) => {
                 let dist = index - currentIndex;
                 if (dist < 0) dist += reviews.length; 
                 
                 if (dist > 2) return null;

                 let zIndex = 10 - dist;
                 let opacity = 1 - (dist * 0.15); 
                 let scale = 1 - (dist * 0.05);   
                 
                 // Reduced translations for cleaner look
                 let translateX = `${dist * 12}px`; 
                 let translateY = `${dist * 16}px`;
                 let rotate = `${dist * 1.5}deg`;
                 
                 let className = "absolute top-0 left-0 w-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] p-7 md:p-10 rounded-[2.5rem] flex flex-col justify-between h-[320px] md:h-[360px] bg-white";

                 if (dist === 0) {
                   className += " border-[#ffc800] border-2 shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-gradient-to-br from-white to-[#ffc800]/5";
                 } else {
                   className += " border-slate-100 border shadow-md";
                 }

                 return (
                   <div 
                     key={review.id}
                     className={className}
                     style={{
                       zIndex,
                       opacity,
                       transform: `translate(${translateX}, ${translateY}) scale(${scale}) rotate(${rotate})`,
                     }}
                   >
                     {/* Quote Icon - Only on top card */}
                     <div className={`absolute top-8 right-8 scale-[2] origin-top-right font-serif text-8xl text-black leading-none transition-opacity duration-500 ${dist === 0 ? 'opacity-5' : 'opacity-0'}`}>
                       &quot;
                     </div>
                     
                     {/* Stars */}
                     <div className="flex gap-1.5 mb-6 z-10 relative">
                       {[...Array(review.rating)].map((_, i) => (
                         <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-[#ffc800] fill-[#ffc800]" />
                       ))}
                     </div>
                     
                     {/* Review Text */}
                     <p className="text-slate-800 font-bold leading-relaxed mb-auto z-10 relative text-sm md:text-lg italic line-clamp-4 md:line-clamp-none">
                       &quot;{review.text}&quot;
                     </p>
                     
                     {/* User Profile - Hidden on back cards to prevent text overlap */}
                     <div className={`flex items-center gap-4 z-10 relative mt-6 pt-6 transition-opacity duration-500 ${dist === 0 ? 'opacity-100' : 'opacity-0'}`}>
                       <div className="w-10 h-10 md:w-14 md:h-14 bg-slate-950 rounded-full flex items-center justify-center font-black text-[#ffc800] text-sm md:text-xl shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
                         {review.initial}
                       </div>
                       <div>
                         <h4 className="text-slate-900 font-black uppercase tracking-widest text-[9px] md:text-xs">{review.name}</h4>
                         <span className="text-slate-500 font-bold text-[8px] md:text-[10px] uppercase tracking-widest">{review.role}</span>
                       </div>
                     </div>
                   </div>
                 );
               })}
             </div>
          </div>
        </div>
        
        {/* Mobile indicators */}
        <div className="flex justify-center gap-2 mt-8 md:hidden">
          {reviews.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 rounded-full transition-all duration-500 ${
                idx === currentIndex ? "w-6 bg-[#ffc800]" : "w-1.5 bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
