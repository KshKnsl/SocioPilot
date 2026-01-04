"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import BrandSelector from "@/components/brand/BrandSelector";
import { 
  Sparkle, 
  Calendar, 
  ChartLineUp, 
  ChatCircleDots, 
  Gear,
  SignOut
} from "@phosphor-icons/react";

const NAV_ITEMS = [
  { label: "Studio", icon: Sparkle, href: "/dashboard" },
  { label: "Scheduler", icon: Calendar, href: "/dashboard/scheduler" },
  { label: "Analytics", icon: ChartLineUp, href: "/dashboard/analytics" },
  { label: "Ai Customer Care", icon: ChatCircleDots, href: "/dashboard/care" },
  { label: "Settings", icon: Gear, href: "/dashboard/settings" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("sp_token");
    localStorage.removeItem("sp_user");
    localStorage.removeItem("sp_selected_brand");
    router.push("/login");
  };

  return (
    <aside className="w-64 border-r-2 border-black bg-background flex flex-col shrink-0 h-full">
      <div className="p-6 space-y-6">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="flex items-center justify-center w-8 h-8 bg-primary border-2 border-black">
            <Image 
              src="/logo.png" 
              alt="SocioPilot" 
              width={20}
              height={20}
              className="brightness-0 invert" 
            />
          </div>
          <span className="text-xl font-bold tracking-tight">SocioPilot</span>
        </Link>

        <div className="pt-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">Active Brand</p>
          <BrandSelector />
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-bold transition-all border-2 ${
                isActive 
                  ? "bg-primary text-primary-foreground border-black" 
                  : "text-muted-foreground border-transparent hover:bg-muted hover:text-foreground hover:border-black"
              }`}
            >
              <item.icon size={20} weight={isActive ? "fill" : "regular"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-4">
        <div className="bg-muted border-2 border-black p-4">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Pro Plan</p>
          <p className="text-[11px] text-muted-foreground mb-3">Unlock auto-posting and advanced analytics.</p>
          <button className="w-full py-2 bg-background border-2 border-black text-[11px] font-bold hover:bg-primary hover:text-white transition-colors">
            Upgrade Now
          </button>
        </div>

        <button 
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          <SignOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
