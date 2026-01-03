"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandSelector from "@/components/BrandSelector";
import { Separator } from "@/components/ui/separator";

export default function Header() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0">
            <div className="flex items-center justify-center w-8 h-8">
              <img 
                src="/logo.png" 
                alt="SocioPilot Logo" 
                className="w-8 h-8 object-contain" 
              />
            </div>
            <span className="text-xl font-bold tracking-tight">SocioPilot</span>
          </Link>
          
          {isDashboard && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <BrandSelector />
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!isDashboard ? (
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
          ) : (
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
