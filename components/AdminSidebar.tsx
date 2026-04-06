"use client";

import { 
  BarChart3, 
  LogOut, 
  MessageSquare,
  UserPlus,
  Bike as BikeIcon,
  Gift,
  LayoutDashboard,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { icon: BarChart3, label: "Analytics", href: "/admin/dashboard" },
    { icon: BikeIcon, label: "Fleet Management", href: "/admin/fleet" },
    { icon: Gift, label: "Coupon System", href: "/admin/coupons" },
    { icon: UserPlus, label: "Worker Hub", href: "/admin/workers" },
    { icon: MessageSquare, label: "Inquiries", href: "/admin/inquiries" }
  ];

  const handleSignOut = () => {
    localStorage.removeItem("user");
    router.push("/admin");
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-[72px] bg-[#0f172a] border-b border-slate-800 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black italic tracking-tighter uppercase text-[#ffc800]">
            REN<span className="text-white">TRIP</span>
          </span>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] bg-slate-900 px-2 py-1 border border-slate-800">
            Admin
          </span>
        </div>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-10 h-10 border border-slate-800 bg-slate-900 flex items-center justify-center text-white active:scale-95 transition-all"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Drawer */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col shrink-0
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0 shadow-2xl shadow-black/80' : '-translate-x-full lg:translate-x-0 lg:static lg:shadow-none'}
      `}>
        <div className="h-[72px] lg:h-auto lg:p-8 border-b border-slate-800 flex flex-col items-center justify-center gap-2 hidden lg:flex">
        <span className="text-xl font-black italic tracking-tighter uppercase text-[#ffc800]">
          REN<span className="text-white">TRIP</span>
        </span>
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] bg-slate-900 px-3 py-1 border border-slate-800">
          Admin Console
        </span>
      </div>
      
      <nav className="flex-1 p-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`w-full flex items-center gap-4 px-4 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-l-2 ${
                isActive 
                  ? "bg-white text-black border-[#ffc800] translate-x-1 shadow-[10px_0_30px_rgba(255,200,0,0.1)]" 
                  : "text-slate-500 hover:text-white hover:bg-white/5 border-transparent"
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? "text-black" : "text-slate-500 group-hover:text-[#ffc800]"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-4 px-4 py-4 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-4 h-4" />
          Sign Out Securely
        </button>
      </div>
    </aside>
    </>
  );
}
