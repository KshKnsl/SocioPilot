"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatCircleDots, Robot, Warning, CheckCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CustomerCarePage() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl brutalist-heading">Customer Care</h1>
          <p className="text-muted-foreground font-medium">AI-powered support and engagement for your brand.</p>
        </div>
        <Badge className="bg-primary text-white brutalist-badge px-4 py-1">Beta</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 brutalist-card">
          <CardHeader className="bg-muted border-b-2 border-black">
            <CardTitle className="font-bold uppercase">Active Conversations</CardTitle>
            <CardDescription className="font-medium">AI is currently monitoring your mentions and DMs.</CardDescription>
          </CardHeader>
          <CardContent className="h-125 flex flex-col items-center justify-center border-4 border-black border-dashed m-6 bg-background">
            <ChatCircleDots size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-bold uppercase">No active conversations to display.</p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="brutalist-card bg-primary/5">
            <CardHeader className="border-b-2 border-black bg-muted">
              <CardTitle className="flex items-center gap-2 font-bold uppercase">
                <Robot size={20} weight="bold" className="text-primary" />
                AI Bot Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between p-3 border-2 border-black bg-background">
                <span className="text-sm font-bold uppercase">Mode</span>
                <Badge className="bg-primary text-white brutalist-badge">Auto-Reply</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border-2 border-black bg-background">
                <span className="text-sm font-bold uppercase">Sentiment Filter</span>
                <Badge variant="outline" className="brutalist-badge">Enabled</Badge>
              </div>
              <Button className="w-full mt-2 bg-black text-white brutalist-button">
                Configure Bot Persona
              </Button>
            </CardContent>
          </Card>

          <Card className="brutalist-card">
            <CardHeader className="bg-muted border-b-2 border-black">
              <CardTitle className="text-sm font-black uppercase tracking-wider">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm font-bold uppercase p-3 border-2 border-black bg-background">
                <CheckCircle size={18} weight="bold" className="text-primary" />
                <span>0 Resolved today</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold uppercase p-3 border-2 border-black bg-background">
                <Warning size={18} weight="bold" className="text-primary" />
                <span>0 Flagged for review</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
