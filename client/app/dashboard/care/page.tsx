"use client";

import { ChatCircleDotsIcon, RobotIcon, WarningIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export default function AICustomerCarePage() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl brutalist-heading">AI Comment Reply Bot</h1>
          <p className="text-muted-foreground font-medium">Intelligent, brand-consistent responses to social media comments.</p>
        </div>
        <span className="bg-primary text-white brutalist-badge px-4 py-1 inline-block font-bold uppercase text-xs">Beta</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 brutalist-card">
          <div className="bg-muted border-b-2 border-black p-6">
            <h3 className="font-bold uppercase mb-2">Comment Monitoring</h3>
            <p className="font-medium">AI is actively monitoring comments across your social platforms.</p>
          </div>
          <div className="h-125 flex flex-col items-center justify-center border-4 border-black border-dashed m-6 bg-background">
            <ChatCircleDotsIcon size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-bold uppercase">No new comments to review.</p>
            <p className="text-xs text-muted-foreground mt-2">AI bot is handling routine responses automatically.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="brutalist-card bg-primary/5">
            <div className="border-b-2 border-black bg-muted p-6">
              <h3 className="flex items-center gap-2 font-bold uppercase">
                <RobotIcon size={20} weight="bold" className="text-primary" />
                AI Reply Bot Status
              </h3>
            </div>
            <div className="pt-6 space-y-4 p-6">
              <div className="flex items-center justify-between p-3 border-2 border-black bg-background">
                <span className="text-sm font-bold uppercase">Auto-Reply Mode</span>
                <span className="bg-primary text-white brutalist-badge px-3 py-1 font-bold uppercase text-xs">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 border-2 border-black bg-background">
                <span className="text-sm font-bold uppercase">Intent Analysis</span>
                <span className="brutalist-badge px-3 py-1 font-bold uppercase text-xs border-2 border-black">Enabled</span>
              </div>
              <Button className="w-full mt-2 bg-black text-white brutalist-button">
                Configure Reply Templates
              </Button>
            </div>
          </div>

          <div className="brutalist-card">
            <div className="bg-muted border-b-2 border-black p-6">
              <h3 className="text-sm font-black uppercase tracking-wider">Reply Statistics</h3>
            </div>
            <div className="pt-6 space-y-4 p-6">
              <div className="flex items-center gap-3 text-sm font-bold uppercase p-3 border-2 border-black bg-background">
                <CheckCircleIcon size={18} weight="bold" className="text-primary" />
                <span>0 Auto-Replies Sent</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold uppercase p-3 border-2 border-black bg-background">
                <WarningIcon size={18} weight="bold" className="text-primary" />
                <span>0 Comments Flagged</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
