"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from 'next/navigation';

export default function Page() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] space-y-12 text-center px-6 py-20">
      <div className="space-y-6">
        <div className="relative z-40 w-24 h-24 bg-primary border-4 border-black brutalist-shadow-lg mx-auto mb-8 flex items-center justify-center">
          <Image src="/logo.png" alt="SocioPilot logo" width={48} height={48} className="" />
        </div> 
        <h1 className="text-6xl brutalist-heading lg:text-8xl">
          Your AI Social <br /> Media <span className="text-primary">Copilot</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-bold uppercase">
          Generate, schedule, and manage brand-consistent social posts with AI-powered tools. Featuring intelligent comment reply automation for authentic brand engagement.
        </p>
      </div>
      
      <Button size="lg" onClick={handleGetStarted} className="h-16 px-12 text-xl brutalist-button bg-primary text-white border-4">
        {isAuthenticated ? "Open Content Studio" : "Get Started - Login Required"}
      </Button>

      <div className="max-w-4xl w-full pt-12">
        <h2 className="text-2xl font-black uppercase tracking-wider mb-6">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="brutalist-card p-6 text-left">
            <h3 className="font-black uppercase text-sm">Content Studio</h3>
            <p className="text-xs text-muted-foreground mt-2">Generate posts using only the models you configured and refine per-brand.</p>
          </div>

          <div className="brutalist-card p-6 text-left">
            <h3 className="font-black uppercase text-sm">All Posts</h3>
            <p className="text-xs text-muted-foreground mt-2">View, edit, and schedule posts. Posts are top-level entities tied to brands.</p>
          </div>

          <div className="brutalist-card p-6 text-left">
            <h3 className="font-black uppercase text-sm">Scheduler</h3>
            <p className="text-xs text-muted-foreground mt-2">Plan your content calendar and manage scheduled posts. Status is auto-managed by the server.</p>
          </div>

          <div className="brutalist-card p-6 text-left bg-primary/5 border-primary">
            <h3 className="font-black uppercase text-sm text-primary">AI Comment Bot</h3>
            <p className="text-xs text-muted-foreground mt-2">Intelligent, brand-consistent responses to social media comments and interactions.</p>
          </div>

          <div className="brutalist-card p-6 text-left">
            <h3 className="font-black uppercase text-sm">Settings</h3>
            <p className="text-xs text-muted-foreground mt-2">Manage brands and API keys for your providers (OpenAI, Groq, Gemini).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
