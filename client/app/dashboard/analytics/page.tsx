"use client";

import { useEffect, useState } from "react";
import { ChartLineUpIcon, UsersIcon, EyeIcon, ShareNetworkIcon, CheckCircleIcon, XCircleIcon, ChatCircleIcon, RepeatIcon, HeartIcon } from "@phosphor-icons/react";
import { getTwitterAnalytics, getRecentTweets } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";
interface TwitterAnalytics {
  name: string;
  username: string;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    like_count: number;
    listed_count: number;
    media_count: number;
  };
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<TwitterAnalytics | null>(null);
  const { twitterConnected } = useAuth();
  const [recentTweets, setRecentTweets] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTwitterAnalytics();
        if (!data?.error) {
          setAnalytics(data);
          const tweets = await getRecentTweets(data.username);
          setRecentTweets(tweets);
        }
      } catch (e) {
        toast.error("Failed to load analytics");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl brutalist-heading">Analytics</h1>
          <p className="text-muted-foreground font-medium">Track your performance and growth across platforms.</p>
        </div>
        <div className="flex items-center gap-2">
          {twitterConnected ? (
            <>
              <CheckCircleIcon size={20} className="text-black" />
              <span className="text-sm font-bold uppercase text-black">Twitter Connected</span>
            </>
          ) : (
            <>
              <XCircleIcon size={20} className="text-black" />
              <span className="text-sm font-bold uppercase text-black">Twitter Not Connected</span>
            </>
          )}
        </div>
      </div>

      {twitterConnected && analytics && (() => {
        const stats = [
          { label: "Followers", value: analytics.public_metrics.followers_count, icon: UsersIcon, description: "Twitter followers" },
          { label: "Following", value: analytics.public_metrics.following_count, icon: ShareNetworkIcon, description: "Accounts you follow" },
          { label: "Total Tweets", value: analytics.public_metrics.tweet_count, icon: ChartLineUpIcon, description: "Total tweets posted" },
          { label: "Likes Given", value: analytics.public_metrics.like_count, icon: EyeIcon, description: "Total likes given" },
          { label: "Media Count", value: analytics.public_metrics.media_count, icon: EyeIcon, description: "Media uploads" },
        ];

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="brutalist-card">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase text-muted-foreground">{stat.label}</p>
                      <h3 className="text-3xl font-black mt-1 text-red-500">{stat.value}</h3>
                      <p className="text-[10px] text-muted-foreground mt-1">{stat.description}</p>
                    </div>
                    <div className="p-3 border-2 border-red-500 bg-muted">
                      <stat.icon size={24} weight="bold" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      {twitterConnected && analytics && (
        <div className="brutalist-card">
          <div className="bg-muted border-b-2 border-red-500 p-6">
            <h3 className="font-bold uppercase">Account Information</h3>
            <p className="font-medium mt-2">Detailed profile information from Twitter.</p>
          </div>
          <div className="p-6">
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
          </div>
        </div>
      )}

      {twitterConnected && recentTweets.length > 0 && (
        <div className="brutalist-card">
          <div className="bg-muted border-b-2 border-red-500 p-6">
            <h3 className="font-bold uppercase">Recent Tweets</h3>
            <p className="font-medium mt-2">Your latest tweets from Nitter.</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recentTweets.map((tweet: any) => (
                <div key={tweet.id} className="twitter-tweet-card">
                  <div className="twitter-tweet-header">
                    <div className="twitter-avatar bg-gray-300 flex items-center justify-center">
                      <UsersIcon size={20} className="text-gray-600" />
                    </div>
                    <div className="twitter-user-info">
                      <div className="flex items-center">
                        <span className="twitter-display-name">{tweet.username}</span>
                        <span className={`twitter-tweet-type ${tweet.type}`}>
                          {tweet.type}
                        </span>
                      </div>
                      <div className="twitter-username">@{tweet.username}</div>
                    </div>
                  </div>

                  <div className="twitter-tweet-text">{tweet.text}</div>

                  <div className="twitter-tweet-stats">
                    <div className="twitter-stat-item">
                      <ChatCircleIcon size={16} />
                      <span>{tweet.replies}</span>
                    </div>
                    <div className="twitter-stat-item">
                      <RepeatIcon size={16} />
                      <span>{tweet.retweets}</span>
                    </div>
                    <div className="twitter-stat-item">
                      <HeartIcon size={16} />
                      <span>{tweet.likes}</span>
                    </div>
                  </div>

                  <div className="twitter-tweet-date">{tweet.created_at}</div>
                  <div className="twitter-tweet-id">Tweet ID: {tweet.id}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
