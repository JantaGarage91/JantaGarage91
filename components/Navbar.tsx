"use client";

import Link from "next/link";
import { 
  Phone, 
  User, 
  MapPin, 
  Menu,
  Smartphone,
  Trophy,
  Star,
  Globe
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    setShowDropdown(false);
    setShowMobileMenu(false);
  }, [pathname]);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    // Initial user check
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem("user");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Listen for storage changes (for sync across components/tabs)
    window.addEventListener("storage", checkUser);
    
    // Interval check for same-page sync if event doesn't fire (standard fallback)
    const interval = setInterval(checkUser, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkUser);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    router.push("/");
    router.refresh();
    // Dispatch scroll event to force checkUser in other components if needed
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full flex flex-col`}
    >
      {/* Premium Top Bar */}
      <div className="w-full bg-[#1e293b] text-white/90 py-1.5 px-6 hidden lg:flex items-center justify-between text-[10px] font-black border-b border-white/5">
        <div className="flex items-center gap-6">
          <Link href="tel:+919127008800" className="flex items-center gap-2 hover:text-[#ffc800] transition-colors border-r border-white/10 pr-6">
            <Phone className="w-3 h-3 text-[#ffc800]" />
            +91 9127008800
          </Link>
          <div className="flex items-center gap-5">
            {[ "Contact Us", "Reviews" ].map((item) => (
              <Link 
                key={item} 
                href={
                  item === "Contact Us" ? "/support" : 
                  item === "Reviews" ? "/#reviews-section" : "#"
                } 
                className="hover:text-[#ffc800] transition-colors relative group"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full transition-all cursor-default group">
            <span className="text-[9px] uppercase tracking-wider text-[#ffc800]">Coming Soon</span>
            <Smartphone className="w-3 h-3 text-white opacity-40" />
          </div>
          <div className="flex items-center gap-4 border-l border-white/10 pl-6 cursor-pointer hover:text-[#ffc800] transition-colors">
            {!user ? (
               <Link href="/auth/user" className="flex items-center gap-2">
                 <User className="w-3.5 h-3.5" />
                 Login / Register
               </Link>
            ) : (
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[9px] text-slate-400">Authenticated: {user.name.split(' ')[0]}</span>
               </div>
            )}
          </div>
          <div className="bg-[#ffc800] text-black px-4 py-1.5 rounded-full flex items-center gap-2 ml-4 hover:scale-105 transition-transform shadow-lg shadow-yellow-500/20 active:scale-95 cursor-pointer">
            <MapPin className="w-3 h-3" />
            <span className="font-black uppercase tracking-tighter">Kanpur</span>
          </div>
        </div>
      </div>

      {/* Main Navbar - Glassmorphism */}
      <div 
        className={`w-full transition-all duration-700 ${
          isScrolled ? "bg-white/95 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] py-2" : "bg-transparent py-4"
        } px-6 sm:px-12 flex items-center justify-between border-b ${isScrolled ? "border-slate-100" : "border-white/10"}`}
      >
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-[#1e293b] to-black rounded-[0.9rem] flex items-center justify-center text-white font-black text-2xl shadow-xl active:scale-90 transition-all group-hover:rotate-3 border border-white/10 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-t from-[#ffc800]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             H
          </div>
          <div className="flex flex-col hidden sm:flex">
            <span className={`text-2xl font-black italic tracking-tighter uppercase leading-none ${isScrolled ? "text-slate-900" : "text-white"}`}>
              HIMALAYAN <span className="text-[#ffc800]">RIDER</span>
            </span>
            <span className={`text-[8px] font-black uppercase tracking-[0.4em] mt-1 ${isScrolled ? "text-slate-400" : "text-white/40"}`}>Ride your freedom</span>
          </div>
          <div className="flex flex-col sm:hidden">
             <span className={`text-xl font-black italic tracking-tighter uppercase leading-none ${isScrolled ? "text-slate-900" : "text-white"}`}>
               HR
             </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className={`hidden md:flex items-center space-x-10 text-[10px] font-black uppercase tracking-[0.25em] ${isScrolled ? "text-slate-700" : "text-white"}`}>
          {[
            { name: "Home", href: "/" },
            { name: "Rent Bikes", href: "/rent-bikes" },
            { name: "About Us", href: "/about-us" },
            { name: "Support", href: "/support" }
          ].map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className="hover:text-[#ffc800] transition-colors relative group py-2"
            >
              {item.name}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-[#ffc800] rounded-full transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* CTA - Handled in Top Bar, removed from main glass nav for clean look */}
        <div className="flex items-center space-x-3">
           {user && (
             <div className="relative" ref={dropdownRef}>
               <button 
                 onClick={() => setShowDropdown(!showDropdown)}
                 className={`flex items-center gap-3 px-5 py-3 rounded-full transition-all active:scale-95 ${
                   isScrolled ? "bg-slate-900 text-[#ffc800]" : "bg-white/10 backdrop-blur-xl text-white border border-white/20"
                 }`}
               >
                 <div className="w-6 h-6 bg-[#ffc800] rounded-full flex items-center justify-center text-black font-black text-[10px]">
                   {user.name.charAt(0)}
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Account</span>
               </button>
               {showDropdown && (
                 <div onClick={() => setShowDropdown(false)} className={`absolute top-full right-0 mt-4 w-48 shadow-2xl z-[60] p-1 border animate-in fade-in zoom-in duration-200 ${
                   isScrolled ? "bg-white border-slate-200" : "bg-[#1e293b] border-white/10"
                 }`}>
                   <div className={`px-4 py-3 border-b ${isScrolled ? "border-slate-100" : "border-white/10"}`}>
                     <div className={`text-[10px] font-black uppercase tracking-tighter ${isScrolled ? "text-slate-900" : "text-white"}`}>{user.name}</div>
                     <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">{user.email}</div>
                   </div>
                   <Link href="/profile" onClick={() => setShowDropdown(false)} className={`block px-4 py-3 text-[9px] font-black uppercase tracking-widest transition-colors ${
                     isScrolled ? "text-slate-600 hover:bg-slate-50 hover:text-slate-900" : "text-slate-300 hover:bg-white/5 hover:text-[#ffc800]"
                   }`}>
                     Profile Dashboard
                   </Link>
                   {user.role === "ADMIN" && (
                     <Link href="/admin/dashboard" onClick={() => setShowDropdown(false)} className={`block px-4 py-3 text-[9px] font-black uppercase tracking-widest transition-colors border-t border-white/5 ${
                       isScrolled ? "text-blue-600 hover:bg-blue-50" : "text-blue-400 hover:bg-blue-500/10"
                     }`}>
                       Management Console
                     </Link>
                   )}
                   <Link href="/bookings" onClick={() => setShowDropdown(false)} className={`block px-4 py-3 text-[9px] font-black uppercase tracking-widest transition-colors ${
                     isScrolled ? "text-slate-600 hover:bg-slate-50 hover:text-slate-900" : "text-slate-300 hover:bg-white/5 hover:text-[#ffc800]"
                   }`}>
                     My Bookings
                   </Link>
                   <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-[9px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-colors">
                     Sign Out
                   </button>
                 </div>
               )}
             </div>
           )}
           <Link href="/auth/user" className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ffc800] text-black hover:bg-white transition-all shadow-xl shadow-yellow-500/20 active:scale-90 lg:hidden hidden">
             {user ? (
               <span className="font-black text-xs uppercase">{user.name.charAt(0)}</span>
             ) : (
               <User className="w-5 h-5" />
             )}
           </Link>

           <button 
             onClick={() => setShowMobileMenu(!showMobileMenu)}
             className={`md:hidden flex items-center justify-center w-12 h-12 rounded-2xl transition-all active:scale-95 ${
               isScrolled ? "bg-slate-100 text-slate-900" : "bg-white/10 text-white border border-white/20"
             }`}
           >
             <Menu className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#020617] border-b border-white/10 shadow-2xl animate-in slide-in-from-top-2">
          <div className="flex flex-col p-6 space-y-4">
            {[
              { name: "Home", href: "/" },
              { name: "Rent Bikes", href: "/rent-bikes" },
              { name: "About Us", href: "/about-us" },
              { name: "Support", href: "/support" }
            ].map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => setShowMobileMenu(false)}
                className="text-white text-xs font-black uppercase tracking-[0.2em] py-2 border-b border-white/5"
              >
                {item.name}
              </Link>
            ))}
            
            {!user ? (
               <Link 
                 href="/auth/user" 
                 onClick={() => setShowMobileMenu(false)}
                 className="flex items-center gap-3 text-[#ffc800] text-xs font-black uppercase tracking-[0.2em] py-2"
               >
                 <User className="w-4 h-4" />
                 Login / Register
               </Link>
            ) : (
               <div className="pt-4 mt-2 border-t border-white/10">
                 <div className="text-[10px] font-black uppercase tracking-tighter text-white mb-4">Account ({user.name})</div>
                 <div className="space-y-3">
                   <Link href="/profile" onClick={() => setShowMobileMenu(false)} className="block text-[#ffc800] text-[10px] font-black uppercase tracking-widest">
                     Profile Dashboard
                   </Link>
                   <Link href="/bookings" onClick={() => setShowMobileMenu(false)} className="block text-[#ffc800] text-[10px] font-black uppercase tracking-widest">
                     My Bookings
                   </Link>
                   {user.role === "ADMIN" && (
                      <Link href="/admin/dashboard" onClick={() => setShowMobileMenu(false)} className="block text-blue-400 text-[10px] font-black uppercase tracking-widest">
                        Management Console
                      </Link>
                   )}
                   <button onClick={handleLogout} className="text-red-500 text-[10px] font-black uppercase tracking-widest text-left mt-4">
                     Sign Out
                   </button>
                 </div>
               </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
