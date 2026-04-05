"use client";

import React from 'react';
import ReviewsSlider from '@/components/ReviewsSlider';
import { 
  Trophy, 
  Users, 
  MapPin, 
  Bike, 
  ShieldCheck, 
  Clock, 
  TrendingUp,
  Target
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="relative pt-40 pb-20 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffc800] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            About <span className="text-[#ffc800]">Himalayan Rider</span>
          </h1>
          <p className="text-slate-400 max-w-3xl mx-auto text-lg md:text-xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            We aren&apos;t just a bike rental service. We are enthusiasts dedicated to providing the ultimate freedom of the open road across India.
          </p>
        </div>
      </section>

      {/* Our Journey / Stats */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: "Community Driven", value: "Trust", icon: Users },
              { label: "Safety First", value: "Verified", icon: ShieldCheck },
              { label: "Always Available", value: "24/7", icon: Clock },
              { label: "Kanpur Based", value: "Local", icon: MapPin }
            ].map((stat, i) => (
              <div key={i} className="p-8 bg-slate-50 rounded-3xl text-center hover:shadow-xl transition-all group border border-slate-100">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6 text-[#ffc800]" />
                </div>
                <div className="text-3xl font-black text-slate-900 mb-1 uppercase tracking-tight italic">{stat.value}</div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-400 font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                <Target className="w-4 h-4" />
                Our Mission
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tight text-slate-900 italic">Driving Mobility Forward</h2>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                Our mission is to simplify bike rentals across India by providing a zero-deposit, transparent, and technology-driven platform that puts the keys in the hands of every explorer.
              </p>
            </div>
            
            <div className="space-y-4 pt-8">
              <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                <TrendingUp className="w-4 h-4" />
                Our Vision
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tight text-slate-900 italic">Leading the Rental Revolution</h2>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                We envision a future where renting a vehicle is as seamless as a click, where ownership is a choice, and where everyone has access to high-quality, maintained motorcycles for their daily needs or adventures.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative">
              <img 
                src="/about-mission.png" 
                alt="Bikers on the road" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
            </div>
            {/* Trust badge floating */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 animate-bounce-subtle">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#ffc800] rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-slate-900">100% Secure</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verified Service</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us? */}
      <section className="py-24 px-6 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-slate-900 mb-6 italic">Why Choose <span className="text-[#ffc800]">Himalayan Rider?</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Zero Security Deposit",
                desc: "We trust our riders. Rent your dream bike without worrying about upfront security deposits.",
                icon: ShieldCheck
              },
              {
                title: "Wide Fleet Selection",
                desc: "From daily scooters to premium superbikes, we have something for every riding style and budget.",
                icon: Bike
              },
              {
                title: "24/7 Roadside Assist",
                desc: "Never feel stranded. Our rapid response team is always a call away, no matter where you are.",
                icon: Trophy
              }
            ].map((feature, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-[#ffc800]/30 transition-all group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:bg-[#ffc800] transition-colors">
                  <feature.icon className="w-7 h-7 text-slate-900" />
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tight mb-4">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section - Integrated as requested */}
      <ReviewsSlider />
    </div>
  );
}
