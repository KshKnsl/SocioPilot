"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getPosts } from "@/lib/api";
import ScheduledList from "./ScheduledList";
import { useRouter } from "next/navigation";

export default function SchedulerPage() {
  const router = useRouter();
  const [counts, setCounts] = useState({ scheduled: 0, posted: 0, failed: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const posts = await getPosts();
        setCounts({
          scheduled: posts.filter((p: any) => p.status === 'scheduled' || !!p.scheduledFor).length,
          posted: posts.filter((p: any) => p.status === 'posted').length,
          failed: 0
        });
      } catch (e) { console.error(e); }
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
        <Button className="brutalist-button" onClick={() => router.push('/dashboard/posts')}>
          <Plus size={20} weight="bold" className="mr-2" />
          Schedule New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card className="brutalist-card">
            <CardHeader className="bg-muted border-b-2 border-black">
              <CardTitle className="font-bold uppercase">Content Calendar</CardTitle>
              <CardDescription className="font-medium">Your upcoming posts across all platforms.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ScheduledList />
            </CardContent>
          </Card>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <Card className="brutalist-card">
            <CardHeader className="bg-muted border-b-2 border-black">
              <CardTitle className="text-sm font-black uppercase tracking-wider">Queue Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
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
            </CardContent>
          </Card>

          <Card className="brutalist-card">
            <CardHeader className="bg-muted border-b-2 border-black">
              <CardTitle className="text-sm font-black uppercase tracking-wider">Auto-Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <p className="text-xs text-muted-foreground font-medium">Connect your accounts to enable automatic posting.</p>
              <Button variant="outline" className="w-full text-xs brutalist-button" onClick={() => router.push('/dashboard/settings')}>Connect Platforms</Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}