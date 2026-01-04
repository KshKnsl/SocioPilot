"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-black bg-background">
      <div className="container flex h-20 items-center justify-between px-8 mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0">
            <div className="flex items-center justify-center w-10 h-10 bg-primary border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Image 
                src="/logo.png" 
                alt="SocioPilot Logo" 
                width={24}
                height={24}
                className="brightness-0 invert" 
              />
            </div>
            <span className="text-2xl brutalist-heading">SocioPilot</span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-black uppercase tracking-wider hover:text-primary transition-colors">
            Login
          </Link>
          <Link href="/dashboard">
            <button className="px-6 py-2.5 bg-primary text-white text-sm brutalist-button">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
