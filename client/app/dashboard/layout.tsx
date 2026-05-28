"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { 
  SparkleIcon, 
  CalendarIcon, 
  ChartLineUpIcon, 
  ChatCircleDotsIcon, 
  GearIcon,
  SignOutIcon,
  ListBulletsIcon
} from "@phosphor-icons/react";

const NAV_ITEMS = [
  { label: "Studio", icon: SparkleIcon, href: "/dashboard/content-studio" },
  { label: "All Posts", icon: ListBulletsIcon, href: "/dashboard/posts" },
  { label: "Scheduler", icon: CalendarIcon, href: "/dashboard/scheduler" },
  { label: "Analytics", icon: ChartLineUpIcon, href: "/dashboard/analytics" },
  { label: "AI Comment Bot", icon: ChatCircleDotsIcon, href: "/dashboard/care" },
  { label: "Settings", icon: GearIcon, href: "/dashboard/settings" },
];

function DashboardSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside className="w-64 border-r-2 border-black bg-background flex flex-col shrink-0 h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="relative z-40 flex items-center justify-center w-8 h-8 bg-primary border-2 border-black">
            <Image 
              src="/logo.png" 
              alt="SocioPilot logo" 
              width={20}
              height={20}
            />
          </div>
          <Link href="/">
            <span className="text-xl font-bold tracking-tight">SocioPilot</span>
          </Link>
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

        {user && (
          <div className="bg-background border-2 border-black p-3">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Logged in as</p>
            <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
          </div>
        )}

        <button 
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          <SignOutIcon size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto relative">
        {children}
      </main>
    </div>
  );
}
