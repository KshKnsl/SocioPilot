import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] space-y-8 text-center px-6">
      <div className="space-y-4">
        <Image src="/logo.png" alt="SocioPilot Logo" width={80} height={80} className="mx-auto mb-4" />
        <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl">
          Your AI Social Media <span className="text-primary">Copilot</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-150 mx-auto">
          Generate high-quality, brand-consistent content across all platforms in seconds.
        </p>
      </div>
      
      <Link href="/dashboard">
        <Button size="lg" className="h-14 px-10 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105">
          Go to Dashboard
        </Button>
      </Link>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 opacity-50">
        {['Twitter', 'Facebook', 'Instagram', 'LinkedIn'].map(p => (
          <div key={p} className="font-semibold tracking-widest uppercase text-xs">{p}</div>
        ))}
      </div>
    </div>
  );
}
