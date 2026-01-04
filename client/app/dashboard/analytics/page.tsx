"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartLineUp, Users, Eye, ShareNetwork } from "@phosphor-icons/react";

export default function AnalyticsPage() {
  const stats = [
    { label: "Total Reach", value: "0", icon: Eye, color: "text-primary" },
    { label: "Engagement", value: "0%", icon: ShareNetwork, color: "text-primary" },
    { label: "Followers", value: "0", icon: Users, color: "text-primary" },
    { label: "Growth", value: "+0%", icon: ChartLineUp, color: "text-primary" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-4xl brutalist-heading">Analytics</h1>
        <p className="text-muted-foreground font-medium">Track your performance and growth across platforms.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="brutalist-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase text-muted-foreground">{stat.label}</p>
                  <h3 className="text-3xl font-black mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 border-2 border-black bg-muted ${stat.color}`}>
                  <stat.icon size={24} weight="bold" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="brutalist-card">
        <CardHeader className="bg-muted border-b-2 border-black">
          <CardTitle className="font-bold uppercase">Performance Overview</CardTitle>
          <CardDescription className="font-medium">Visualizing your brand's impact over time.</CardDescription>
        </CardHeader>
        <CardContent className="h-100 flex flex-col items-center justify-center border-4 border-black border-dashed m-6 bg-background">
          <ChartLineUp size={48} className="text-muted-foreground mb-4" />
          <p className="text-muted-foreground font-bold uppercase">Connect your social accounts to see live data.</p>
        </CardContent>
      </Card>
    </div>
  );
}
