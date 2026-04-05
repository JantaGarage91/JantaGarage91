"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck, Clock } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 pt-40 pb-12">
       <div className="max-w-4xl mx-auto px-6 sm:px-12">
         {/* Hero Header - Smaller spacing and text */}
         <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-slate-900 mb-4 leading-none">
             How Can We <span className="text-[#ffc800] relative inline-block">Help<span className="absolute bottom-1 left-0 w-full h-2 bg-[#ffc800]/20 -z-10 -skew-x-12"></span></span> You?
           </h1>
           <p className="text-slate-500 max-w-xl mx-auto text-base font-medium">
             Our support team is ready to assist you with any questions.
           </p>
         </div>

         <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* Contact Info - Compact version */}
            <div className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-700 delay-100">
               <div className="bg-[#1e293b] p-6 rounded-[1.5rem] text-white shadow-xl relative overflow-hidden group h-full">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#ffc800] rounded-full mix-blend-multiply filter blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-700 transform translate-x-1/2 -translate-y-1/2"></div>
                  
                  <h3 className="text-xl font-black uppercase tracking-tight mb-6">Get In Touch</h3>
                  
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0 border border-white/5">
                         <Phone className="w-4 h-4 text-[#ffc800]" />
                       </div>
                       <div>
                         <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Call Us</p>
                         <p className="text-base font-bold">+91 91270 08800</p>
                       </div>
                     </div>

                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0 border border-white/5">
                         <Mail className="w-4 h-4 text-[#ffc800]" />
                       </div>
                       <div>
                         <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Email</p>
                         <p className="text-base font-bold">support@himalayanrider.in</p>
                       </div>
                     </div>

                     <div className="flex items-start gap-3">
                       <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0 border border-white/5 mt-1">
                         <MapPin className="w-4 h-4 text-[#ffc800]" />
                       </div>
                       <div>
                         <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Location</p>
                         <p className="text-sm font-medium text-slate-300">Kanpur, Uttar Pradesh, 208001</p>
                       </div>
                     </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-2">
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                       <Clock className="w-4 h-4 text-[#ffc800]" />
                       <span>Mon-Sat, 9AM to 8PM</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                       <ShieldCheck className="w-4 h-4 text-[#ffc800]" />
                       <span>Roadside Assistance</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Contact Form - More compact padding and smaller inputs */}
            <div className="bg-white p-6 md:p-8 rounded-[1.5rem] shadow-lg border border-slate-100 animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
               <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="grid md:grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-700">Name</label>
                     <input 
                       type="text" 
                       name="name"
                       value={formData.name}
                       onChange={handleChange}
                       required
                       className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ffc800] transition-all"
                       placeholder="Full Name"
                     />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-700">Email</label>
                     <input 
                       type="email" 
                       name="email"
                       value={formData.email}
                       onChange={handleChange}
                       required
                       className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ffc800] transition-all"
                       placeholder="Email Address"
                     />
                   </div>
                 </div>

                 <div className="space-y-1.5">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-700">Subject</label>
                   <select 
                     name="subject"
                     value={formData.subject}
                     onChange={handleChange}
                     required
                     className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none cursor-pointer"
                   >
                     <option value="" disabled>Select a topic</option>
                     <option value="Booking Inquiry">Booking Inquiry</option>
                     <option value="Billing & Payments">Billing & Payments</option>
                     <option value="Report an Issue">Report an Issue</option>
                     <option value="Other">Other</option>
                   </select>
                 </div>

                 <div className="space-y-1.5">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-700">Message</label>
                   <textarea 
                     name="message"
                     value={formData.message}
                     onChange={handleChange}
                     required
                     rows={3}
                     className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ffc800] transition-all resize-none"
                     placeholder="Message"
                   ></textarea>
                 </div>

                 {status === 'error' && (
                   <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg border border-red-100 text-[11px] font-medium">
                     {errorMessage}
                   </div>
                 )}

                 {status === 'success' && (
                   <div className="bg-green-50 text-green-600 px-3 py-2 rounded-lg border border-green-100 text-[11px] font-medium">
                     Submitted successfully!
                   </div>
                 )}

                 <button 
                   type="submit"
                   disabled={status === 'loading'}
                   className={`w-full flex items-center justify-center gap-2 bg-[#1e293b] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all group ${
                     status === 'loading' ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#ffc800] hover:text-black active:scale-[0.98]'
                   }`}
                 >
                   <span>{status === 'loading' ? 'Sending...' : 'Send'}</span>
                   {status !== 'loading' && (
                     <Send className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                   )}
                 </button>
               </form>
            </div>
         </div>
       </div>
    </div>
  );
}
