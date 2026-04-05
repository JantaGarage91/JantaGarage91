"use client";

import Link from "next/link";
import { 
  Share2,
  Globe,
  Camera,
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight,
  ArrowUpRight
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 pt-16 pb-8 px-6 overflow-hidden relative">
      {/* Decorative Blur */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col gap-10 relative z-10">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand & Mission */}
          <div className="flex flex-col space-y-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center font-black text-2xl text-black shadow-lg shadow-primary/20">
                H
              </div>
              <span className="text-3xl font-black tracking-tight text-white uppercase italic">
                HIMALAYAN <span className="text-primary tracking-tighter">RIDER</span>
              </span>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed">
              Experience the freedom of the open road. India's most trusted bike rental service with over 500k happy riders across 62+ cities.
            </p>
            <div className="flex space-x-4 pt-2">
              {[Share2, Globe, Camera, Mail].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-black hover:scale-110 transition-all shadow-lg">
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Explore</h3>
            <ul className="space-y-4">
              {["Fleet", "Rentals"].map((item) => (
                <li key={item}>
                  <Link href="/rent-bikes" className="text-slate-400 font-bold hover:text-primary transition-all flex items-center group">
                    <ChevronRight className="w-4 h-4 mr-2 text-slate-600 group-hover:text-primary transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Company</h3>
            <ul className="space-y-4">
              {["About Us", "Contact Us", "Terms & Conditions", "Privacy Policy"].map((item) => (
                <li key={item}>
                  <Link href={item === "Contact Us" ? "/support" : item === "About Us" ? "/about-us" : "#"} className="text-slate-400 font-bold hover:text-primary transition-all flex items-center group">
                    <ChevronRight className="w-4 h-4 mr-2 text-slate-600 group-hover:text-primary transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Join the Community</h3>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">
              Subscribe to get the latest machine updates and rider safety guides.
            </p>
            <div className="flex flex-col space-y-3">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Your Email"
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white font-bold transition-all placeholder:text-slate-600"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-primary px-4 rounded-xl text-black font-black hover:bg-primary-hover transition-all">
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-slate-800/50 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-sm">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Call Us</span>
                <span className="text-white font-black">+91 91270 08800</span>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Support</span>
                <span className="text-white font-black">hello@himalayanrider.in</span>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Office</span>
                <span className="text-white font-black">Guwahati, Assam</span>
              </div>
           </div>
        </div>

        {/* Final Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-800 gap-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            © {new Date().getFullYear()} HIMALAYAN <span className="text-primary">RIDER</span> RENTALS PVT LTD. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System Status: Online</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
