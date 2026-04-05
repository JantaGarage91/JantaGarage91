"use client";

import { 
  BarChart3, 
  LogOut, 
  MessageSquare,
  UserPlus,
  Bike as BikeIcon,
  Gift,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

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
    <aside className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col hidden lg:flex shrink-0">
      <div className="p-8 border-b border-slate-800 flex flex-col items-center justify-center gap-2">
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
  );
}
