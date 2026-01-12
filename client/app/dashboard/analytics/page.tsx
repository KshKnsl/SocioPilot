"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartLineUp, Users, Eye, ShareNetwork, CheckCircle, XCircle } from "@phosphor-icons/react";
import { getTwitterAnalytics, getTwitterStatus } from "@/lib/api";
import { toast } from "sonner";

interface TwitterAnalytics {
  name: string;
  username: string;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
  };
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<TwitterAnalytics | null>(null);
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // Check if Twitter is connected
        const status = await getTwitterStatus();
        setTwitterConnected(status.connected);
        
        if (status.connected) {
          // Fetch analytics data
          const data = await getTwitterAnalytics();
          console.log('Twitter Analytics Data:', data);
          setAnalytics(data);
        }
      } catch (e) {
        console.error('Failed to fetch analytics:', e);
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl brutalist-heading">Analytics</h1>
          <p className="text-muted-foreground font-medium">Track your performance and growth across platforms.</p>
        </div>
        <div className="flex items-center gap-2">
          {twitterConnected ? (
            <>
              <CheckCircle size={20} className="text-black" />
              <span className="text-sm font-bold uppercase text-black">Twitter Connected</span>
            </>
          ) : (
            <>
              <XCircle size={20} className="text-black" />
              <span className="text-sm font-bold uppercase text-black">Twitter Not Connected</span>
            </>
          )}
        </div>
      </div>

      {twitterConnected && analytics && (() => {
        const stats = [
          { label: "Followers", value: analytics.public_metrics.followers_count, icon: Users, description: "Twitter followers" },
          { label: "Following", value: analytics.public_metrics.following_count, icon: ShareNetwork, description: "Accounts you follow" },
          { label: "Total Tweets", value: analytics.public_metrics.tweet_count, icon: ChartLineUp, description: "Total tweets posted" },
          { label: "Likes Given", value: analytics.public_metrics.like_count, icon: Eye, description: "Total likes given" },
          { label: "Listed Count", value: analytics.public_metrics.listed_count, icon: Users, description: "Times added to lists" },
          { label: "Media Count", value: analytics.public_metrics.media_count, icon: Eye, description: "Media uploads" },
        ];

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="brutalist-card">
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase text-muted-foreground">{stat.label}</p>
                      <h3 className="text-3xl font-black mt-1 text-red-500">{loading ? "..." : stat.value}</h3>
                      <p className="text-[10px] text-muted-foreground mt-1">{stat.description}</p>
                    </div>
                    <div className="p-3 border-2 border-red-500 bg-muted">
                      <stat.icon size={24} weight="bold" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      })()}

      {twitterConnected && analytics && (
        <Card className="brutalist-card">
          <CardHeader className="bg-muted border-b-2 border-red-500">
            <CardTitle className="font-bold uppercase">Account Information</CardTitle>
            <CardDescription className="font-medium">Detailed profile information from Twitter.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-black uppercase text-muted-foreground">Display Name</label>
                <p className="text-lg font-bold">{analytics.name}</p>
              </div>
              <div>
                <label className="text-xs font-black uppercase text-muted-foreground">Username</label>
                <p className="text-lg font-bold">@{analytics.username}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="brutalist-card">
        <CardHeader className="bg-muted border-b-2 border-red-500">
          <CardTitle className="font-bold uppercase">Performance Overview</CardTitle>
          <CardDescription className="font-medium">
            {twitterConnected 
              ? "Visualizing your brand's impact over time." 
              : "Connect your Twitter account to see live analytics and performance data."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="h-100 flex flex-col items-center justify-center border-4 border-red-500 border-dashed m-6 bg-background">
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-muted-foreground font-bold uppercase">Loading analytics...</p>
            </div>
          ) : twitterConnected ? (
            <div className="text-center space-y-4">
              <ChartLineUp size={48} className="text-red-500 mx-auto" />
              <div className="space-y-2">
                <p className="text-lg font-bold uppercase">Analytics Active</p>
                <p className="text-muted-foreground">Real-time Twitter profile data is being displayed.</p>
                {analytics.verified && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <CheckCircle size={16} className="text-red-500" />
                    <span className="text-sm font-bold text-red-600">Verified Account</span>
                  </div>
                )}
                {analytics.name && (
                  <p className="text-xs text-muted-foreground mt-2">@{analytics.username}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <ChartLineUp size={48} className="text-red-500" />
              <div className="space-y-2">
                <p className="text-lg font-bold uppercase">No Data Available</p>
                <p className="text-muted-foreground">Connect your Twitter account in Settings to see live analytics.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
