"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("sp_token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-black uppercase tracking-tight mb-4">Welcome to SocioPilot</h1>
        <p className="text-muted-foreground mb-8">Your social media content management dashboard</p>
        <p className="text-lg">Use the sidebar to navigate to different sections.</p>
      </div>
    </div>
  );
}