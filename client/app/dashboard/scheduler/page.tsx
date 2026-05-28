"use client";

import { PlusIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { getQueueStats } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ScheduledList from "./ScheduledList";
import Link from "next/link";

export default function SchedulerPage() {
  const [counts, setCounts] = useState({ scheduled: 0, posted: 0, failed: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const data = await getQueueStats();
        setCounts({
          scheduled: data.posts.scheduled,
          posted: data.posts.posted,
          failed: data.posts.failed
        });
      } catch (e) { 
        toast.error("Failed to fetch post counts");
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl brutalist-heading">Scheduler</h1>
          <p className="text-muted-foreground font-medium">Plan and automate your social media presence.</p>
        </div>
        <Link href="/dashboard/posts">
          <Button className="brutalist-button">
            <PlusIcon size={20} weight="bold" className="mr-2" />
            Schedule New Post
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="brutalist-card">
            <div className="bg-muted border-b-2 border-black p-6">
              <h3 className="font-bold uppercase">Content Calendar</h3>
              <p className="font-medium mt-2">Your upcoming posts across all platforms.</p>
            </div>
            <div className="p-6">
              <ScheduledList />
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <div className="brutalist-card">
            <div className="bg-muted border-b-2 border-black p-6">
              <h3 className="text-sm font-black uppercase tracking-wider">Queue Status</h3>
            </div>
            <div className="space-y-4 pt-4 p-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-bold">Scheduled</span>
                <span className="font-black">{counts.scheduled}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-bold">Published</span>
                <span className="font-black">{counts.posted}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-bold">Failed</span>
                <span className="font-black text-primary">{counts.failed}</span>
              </div>
            </div>
          </div>

          <div className="brutalist-card">
            <div className="bg-muted border-b-2 border-black p-6">
              <h3 className="text-sm font-black uppercase tracking-wider">Auto-Post Settings</h3>
            </div>
            <div className="space-y-4 pt-4 p-6">
              <p className="text-xs text-muted-foreground font-medium">Connect your accounts to enable automatic posting.</p>
              <Link href="/dashboard/settings">
                <Button variant="outline" className="w-full text-xs brutalist-button">Connect Platforms</Button>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}