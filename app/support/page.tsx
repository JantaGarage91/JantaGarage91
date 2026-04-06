"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ShieldCheck, Clock, ArrowRight, MessageSquare } from 'lucide-react';
import Navbar from "@/components/Navbar";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sansSelection overflow-x-hidden">
      <Navbar />
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-[#1e293b]/20 to-transparent pointer-events-none"></div>
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-[#ffc800]/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-40 pb-24">
         {/* Page Header */}
         <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
           <div className="inline-flex items-center gap-3 bg-[#1e293b] px-4 py-2 -skew-x-12 border border-white/5 mb-6">
              <MessageSquare className="w-4 h-4 text-[#ffc800] skew-x-12" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white skew-x-12">Support Command Center</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4 leading-none text-white">
             STAY <span className="text-[#ffc800]">CONNECTED</span>
           </h1>
           <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-bold uppercase tracking-widest opacity-60">
             Whether you&apos;re planning a cross-country tour or need immediate roadside assistance, our team is always on standby.
           </p>
         </div>

         <div className="grid lg:grid-cols-12 gap-10">
            {/* Contact Info Deck */}
            <div className="lg:col-span-5 space-y-6">
               <div className="bg-[#0f172a] border border-white/5 p-8 md:p-10 relative overflow-hidden group">
                  {/* Skewed Accent */}
                  <div className="absolute top-0 right-0 w-1 h-full bg-[#ffc800]"></div>
                  
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#ffc800] mb-10">Rapid Response Hub</h3>
                  
                  <div className="space-y-8">
                     <div className="flex items-start gap-5 group/item">
                       <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center -skew-x-12 group-hover/item:bg-[#ffc800] transition-colors duration-500">
                         <Phone className="w-5 h-5 text-[#ffc800] skew-x-12 group-hover/item:text-black" />
                       </div>
                       <div>
                         <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black mb-1">Direct Hotline</p>
                         <p className="text-xl font-black tracking-tight text-white">+91 91270 08800</p>
                         <p className="text-[10px] text-emerald-500 font-bold uppercase mt-1">Available 24/7 for On-Road Support</p>
                       </div>
                     </div>

                     <div className="flex items-start gap-5 group/item">
                       <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center -skew-x-12 group-hover/item:bg-[#ffc800] transition-colors duration-500">
                         <Mail className="w-5 h-5 text-[#ffc800] skew-x-12 group-hover/item:text-black" />
                       </div>
                       <div>
                         <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black mb-1">Electronic Mail</p>
                         <p className="text-xl font-black tracking-tight text-white uppercase">support@himalayanrider.in</p>
                       </div>
                     </div>

                     <div className="flex items-start gap-5 group/item">
                       <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center -skew-x-12 group-hover/item:bg-[#ffc800] transition-colors duration-500">
                         <MapPin className="w-5 h-5 text-[#ffc800] skew-x-12 group-hover/item:text-black" />
                       </div>
                       <div>
                         <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black mb-1">Base of Operations</p>
                         <p className="text-xl font-black tracking-tight text-white uppercase italic">Kanpur, Uttar Pradesh, 208001</p>
                       </div>
                     </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/5 space-y-4">
                     <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                       <Clock className="w-4 h-4 text-[#ffc800]" />
                       <span>Hangar Hours: Mon-Sat, 9AM to 8PM</span>
                     </div>
                     <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#ffc800]">
                       <ShieldCheck className="w-4 h-4" />
                       <span>Certified Fleet Protection Guaranteed</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Contact Form - Dark Modern Edition */}
            <div className="lg:col-span-7">
               <div className="bg-[#0f172a] border border-white/5 p-8 md:p-12 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ffc800] to-transparent"></div>
                  
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffc800] ml-1">Registry Name</label>
                        <div className="relative -skew-x-12 bg-[#020617] border border-white/5 focus-within:border-[#ffc800]/50 transition-all">
                           <input 
                             type="text" 
                             name="name"
                             value={formData.name}
                             onChange={handleChange}
                             required
                             className="skew-x-12 w-full px-6 py-4 bg-transparent text-sm font-black text-white focus:outline-none placeholder:text-slate-700"
                             placeholder="E.G. RAHUL DIXIT"
                           />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffc800] ml-1">Digital Signal (Email)</label>
                        <div className="relative -skew-x-12 bg-[#020617] border border-white/5 focus-within:border-[#ffc800]/50 transition-all">
                           <input 
                             type="email" 
                             name="email"
                             value={formData.email}
                             onChange={handleChange}
                             required
                             className="skew-x-12 w-full px-6 py-4 bg-transparent text-sm font-black text-white focus:outline-none placeholder:text-slate-700 font-mono"
                             placeholder="OFFICIAL@EMAIL.COM"
                           />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffc800] ml-1">Operational Topic</label>
                      <div className="relative -skew-x-12 bg-[#020617] border border-white/5 focus-within:border-[#ffc800]/50 transition-all px-4">
                        <select 
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="skew-x-12 w-full bg-transparent py-4 text-xs font-black text-white focus:outline-none cursor-pointer appearance-none uppercase tracking-widest"
                        >
                          <option value="" disabled className="bg-[#0f172a]">Select Mission Directive</option>
                          <option value="Booking Inquiry" className="bg-[#0f172a]">Booking Inquiry</option>
                          <option value="Billing & Payments" className="bg-[#0f172a]">Billing & Payments</option>
                          <option value="Report an Issue" className="bg-[#0f172a]">Report an Issue</option>
                          <option value="Other" className="bg-[#0f172a]">General Transmission</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffc800] ml-1">Detail Transmission</label>
                      <div className="relative -skew-x-2 bg-[#020617] border border-white/5 focus-within:border-[#ffc800]/50 transition-all">
                        <textarea 
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={4}
                          className="w-full px-6 py-4 bg-transparent text-sm font-black text-white focus:outline-none resize-none placeholder:text-slate-700 leading-relaxed"
                          placeholder="ENTER DETAILED MESSAGE HERE..."
                        ></textarea>
                      </div>
                    </div>

                    {status === 'error' && (
                      <div className="bg-red-500/10 text-red-500 px-6 py-4 -skew-x-12 border border-red-500/20 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-2">
                        <div className="skew-x-12 flex items-center gap-3">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                          {errorMessage}
                        </div>
                      </div>
                    )}

                    {status === 'success' && (
                      <div className="bg-emerald-500/10 text-emerald-500 px-6 py-4 -skew-x-12 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-2">
                        <div className="skew-x-12 flex items-center gap-3">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          Transmission Received. Standing By.
                        </div>
                      </div>
                    )}

                    <button 
                      type="submit"
                      disabled={status === 'loading'}
                      className={`w-full relative h-[64px] transition-all overflow-hidden group ${
                        status === 'loading' ? 'bg-slate-800 cursor-not-allowed text-slate-500' : 'bg-white hover:bg-[#ffc800] text-black active:scale-[0.98]'
                      }`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center gap-4">
                        <span className="text-[11px] font-black uppercase tracking-[0.3em]">
                          {status === 'loading' ? 'Encrypting Signal...' : 'Initiate Transmission'}
                        </span>
                        {status !== 'loading' && (
                          <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        )}
                      </div>
                      {/* Interactive Bottom Bar */}
                      <div className="absolute bottom-0 left-0 w-0 h-1 bg-black group-hover:w-full transition-all duration-500"></div>
                    </button>
                  </form>
               </div>
            </div>
         </div>
      </main>

      {/* Decorative Footer Spacer */}
      <div className="h-24 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
}
