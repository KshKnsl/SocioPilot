"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export default function SchedulerPage() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl brutalist-heading">Scheduler</h1>
          <p className="text-muted-foreground font-medium">Plan and automate your social media presence.</p>
        </div>
        <Button className="brutalist-button">
          <Plus size={18} className="mr-2" /> Schedule Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 brutalist-card">
          <CardHeader className="bg-muted border-b-2 border-black">
            <CardTitle className="font-bold uppercase">Content Calendar</CardTitle>
            <CardDescription className="font-medium">Your upcoming posts across all platforms.</CardDescription>
          </CardHeader>
          <CardContent className="h-[500px] flex flex-col items-center justify-center border-4 border-black border-dashed m-6 bg-background">
            <CalendarIcon size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-bold uppercase">Calendar view coming soon.</p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="brutalist-card">
            <CardHeader className="bg-muted border-b-2 border-black">
              <CardTitle className="text-sm font-black uppercase tracking-wider">Queue Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-bold">Scheduled</span>
                <span className="font-black">0</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-bold">Published</span>
                <span className="font-black">0</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-bold">Failed</span>
                <span className="font-black text-primary">0</span>
              </div>
            </CardContent>
          </Card>

          <Card className="brutalist-card">
            <CardHeader className="bg-muted border-b-2 border-black">
              <CardTitle className="text-sm font-black uppercase tracking-wider">Auto-Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <p className="text-xs text-muted-foreground font-medium">Connect your accounts to enable automatic posting.</p>
              <Button variant="outline" className="w-full text-xs brutalist-button">Connect Platforms</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
