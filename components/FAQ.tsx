"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle, MessageCircle, PhoneCall, Mail } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const faqs = [
    {
      q: "How can I rent a bike?",
      a: "Renting a bike of your choice is simple. Just select the bike which you want to rent and book it. On the next step, you shall need to visit the location to pick the bike up."
    },
    {
      q: "What documents are required for renting a bike?",
      a: "You need to submit an ID in original and the copy of Driving License."
    },
    {
      q: "Is fuel included with the rental?",
      a: "No. Fuel is not included with rental amount."
    },
    {
      q: "How much security deposit I need to pay?",
      a: "There is a varying security deposit for renting a bike depending of the location and type of bike. This is given with the bike listing."
    },
    {
      q: "When shall I get the security deposit back?",
      a: "You shall be getting the security deposit immediately after returning the bike."
    },
    {
      q: "Are long term bike rentals cheaper?",
      a: "Yes. You can avail upto 70% discount on monthly bike rentals."
    },
    {
      q: "What are the various bike rental formats?",
      a: "You can rent a bike on a daily, weekly and monthly. Longer the duration, cheaper the rent."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-slate-50 py-16 px-6 relative overflow-hidden border-t border-slate-200">
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Left-Aligned */}
        <div className="flex flex-col items-start mb-10 space-y-2 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">
            Frequently Asked <span className="text-[#ffc800]">Questions</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            Everything you need to know about billing, tracking, documentation, and our fleet.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Side: Accordion (col-span-7) */}
          <div className="lg:col-span-7 space-y-5">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              
              return (
                <div key={i} className="relative group p-2">
                  
                  {/* Skewed Parallelogram Background */}
                  <div 
                    className={`absolute inset-0 -skew-x-[10deg] transition-all duration-300 border-2 ${
                      isOpen 
                      ? "bg-white border-[#ffc800] shadow-[0_10px_30px_rgba(255,200,0,0.15)] z-10" 
                      : "bg-white border-slate-100 group-hover:border-slate-300 shadow-sm z-0"
                    }`}
                  ></div>

                  {/* Straight Content */}
                  <div className="relative z-20">
                    <button
                      onClick={() => toggleFAQ(i)}
                      className="w-full text-left px-6 py-3 flex items-center justify-between focus:outline-none"
                    >
                      <span className={`text-sm md:text-base font-bold pr-4 transition-colors ${isOpen ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"}`}>
                        {faq.q}
                      </span>
                      
                      {/* Indicator Icon */}
                      <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center transition-all duration-300 border border-transparent ${isOpen ? "bg-[#ffc800] text-black rotate-180 -skew-x-12" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 -skew-x-12"}`}>
                        <div className="skew-x-12">
                          {isOpen ? <Minus className="w-3 h-3 font-bold" /> : <Plus className="w-3 h-3 font-bold" />}
                        </div>
                      </div>
                    </button>
                    
                    {/* Expandable Content Area */}
                    <div 
                      className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? "max-h-[200px] opacity-100 pb-4" : "max-h-0 opacity-0 pb-0"
                      }`}
                    >
                      <p className="text-slate-500 text-sm font-medium leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Side: Creative "Accha" Support Design (col-span-5) */}
          <div className="lg:col-span-5 lg:sticky lg:top-10">
            {/* The Main Dark Skewed Card */}
            <div className="relative bg-slate-900 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl border-4 border-slate-800">
              
              {/* Background Art */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#ffc800]/10 rounded-full blur-[80px]"></div>
              <div className="absolute bottom-0 right-0 text-white/5 font-black text-9xl tracking-tighter leading-none translate-x-4 translate-y-4">?</div>
              
              <div className="relative z-10 flex flex-col space-y-8">
                {/* Floating Icon Head */}
                <div className="w-16 h-16 bg-[#ffc800] rounded-2xl flex items-center justify-center rotate-[-5deg] shadow-lg shadow-[#ffc800]/20 border-[3px] border-white">
                  <MessageCircle className="w-8 h-8 text-black fill-transparent" />
                </div>

                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-8">
                    Still Have <br/> <span className="text-[#ffc800]">Questions?</span>
                  </h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    Can&apos;t find the answer you&apos;re looking for? Our dedicated 24/7 support team is here to help you get on the road faster.
                  </p>
                </div>
                
                {/* Contact Options List */}
                <div className="space-y-4 border-t border-slate-800 pt-8">
                  
                  {/* Call Strip */}
                  <div className="group flex items-center gap-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-[1.5rem] p-4 cursor-pointer transition-all">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-300 group-hover:text-black group-hover:bg-[#ffc800] transition-colors">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-[#ffc800] transition-colors">Call Us Directly</h4>
                      <p className="text-white font-bold tracking-wider">+91 91270 08800</p>
                    </div>
                  </div>

                  {/* Mail Strip */}
                  <div className="group flex items-center gap-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-[1.5rem] p-4 cursor-pointer transition-all">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-300 group-hover:text-black group-hover:bg-[#ffc800] transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-[#ffc800] transition-colors">Shoot an Email</h4>
                      <p className="text-white font-bold tracking-wider">hello@rentrip.in</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            
            {/* Hanging decorative tag */}
            <div className="absolute -bottom-4 right-10 bg-white border border-slate-200 shadow-xl px-6 py-3 rounded-full flex items-center gap-2 rotate-2 hover:-translate-y-1 transition-transform">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">We are online</span>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
