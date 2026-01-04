import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] space-y-12 text-center px-6 py-20">
      <div className="space-y-6">
        <div className="w-24 h-24 bg-primary border-4 border-black brutalist-shadow-lg mx-auto mb-8 flex items-center justify-center">
          <Image src="/logo.png" alt="SocioPilot Logo" width={48} height={48} className="brightness-0 invert" />
        </div>
        <h1 className="text-6xl brutalist-heading lg:text-8xl">
          Your AI Social <br /> Media <span className="text-primary">Copilot</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-bold uppercase">
          Generate high-quality, brand-consistent content across all platforms in seconds.
        </p>
      </div>
      
      <Link href="/dashboard">
        <Button size="lg" className="h-16 px-12 text-xl brutalist-button bg-primary text-white border-4">
          Go to Dashboard
        </Button>
      </Link>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16">
        {['Twitter', 'Facebook', 'Instagram', 'LinkedIn'].map(p => (
          <div key={p} className="brutalist-card px-6 py-3 font-black tracking-widest uppercase text-sm">{p}</div>
        ))}
      </div>
    </div>
  );
}
