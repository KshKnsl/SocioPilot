"use client";

import { useState, useEffect } from "react";
import { generate } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { updatePost } from "@/lib/api";
import PlatformIcon from "@/components/PlatformIcon";
import { toast } from "sonner";
import { providerFromModel } from "@/lib/utils";
import { Config, Post, GenerateResponse } from "@/lib/types";
import { CopyButton } from "@/components/CopyButton";
const platformsList = ["twitter", "linkedin", "instagram", "facebook"];

export default function ContentStudioPage() {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<Config>({
    topic: "",
    tone: "professional",
    platforms: "all",
    numPosts: 3,
    numIdeas: 5,
    additionalInstructions: "",
    topicCount: 3,
    language: "English",
    generateImages: false,
    model: "gpt-4o-mini",
    topicsPromptExpansion: "",
    postsPromptExpansion: "",
  });

  useEffect(() => {
    const savedConfigStr = localStorage.getItem("sp_config");
    const savedConfig = savedConfigStr ? JSON.parse(savedConfigStr) : {};
    setConfig((prev) => ({ ...prev, ...savedConfig }));
  }, []);

  const updateConfig = (updates: Partial<Config>) => {
    setConfig((prev) => {
      const newConfig = { ...prev, ...updates };
      localStorage.setItem("sp_config", JSON.stringify(newConfig));
      return newConfig;
    });
  };

  const apiProvider = providerFromModel(config.model);

  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [localResult, setLocalResult] = useState(result);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingScheduledFor, setEditingScheduledFor] = useState("");

  useEffect(() => setLocalResult(result), [result]);

  const startEdit = (post: Post) => {
    setEditingId(post._id);
    setEditingContent(post.content);
    setEditingScheduledFor(post.scheduledFor || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingContent("");
    setEditingScheduledFor("");
  };

  const saveEdit = async (postId: string) => {
    try {
      const payload: any = { content: editingContent };
      payload.scheduledFor = editingScheduledFor || null;
      await updatePost(postId, payload);
      setLocalResult((prev: any) => ({
        ...prev,
        posts: prev.posts.map((p: Post) => p._id === postId ? { ...p, content: editingContent, scheduledFor: payload.scheduledFor } : p)
      }));
      cancelEdit();
      toast.success("Post updated successfully!");
    } catch (e: any) {
      toast.error(e.message || 'Update failed');
    }
  };

  async function onGenerate() {
    setLoading(true);
    setResult(null);
    try {
      let platformsArr;
      if (config.platforms === "all")
        platformsArr = platformsList;
      else
        platformsArr = [config.platforms];
      const provider = apiProvider;
      const { openaiKey, groqKey, geminiKey, ...payloadConfig } = config as any;
      const payload = {
        ...payloadConfig,
        platforms: platformsArr,
        provider
      };
      const res = await generate(payload);
      setResult(res);
      toast.success("Content generated successfully!");
    } catch (e: any) {
      toast.error(e?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight">Content Studio</h1>
          <p className="text-muted-foreground mt-2">Generate and schedule social media content</p>
        </div>
        <Button
          onClick={onGenerate}
          disabled={loading}
          className="brutalist-button text-lg px-8 py-3 h-auto"
        >
          {loading ? "Generating..." : "Generate Content"}
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="brutalist-card h-fit">
            <div className="bg-muted border-b-2 border-black p-6">
              <h3 className="text-xl brutalist-heading">Configuration</h3>
            </div>
            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); onGenerate(); }} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-sm font-bold uppercase">Topic</Label>
                  <Input
                    id="topic"
                    value={config.topic}
                    onChange={(e) => updateConfig({ topic: e.target.value })}
                    placeholder="Enter your content topic..."
                    className="brutalist-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone" className="text-sm font-bold uppercase">Tone</Label>
                  <Select value={config.tone} onValueChange={(value) => value && updateConfig({ tone: value })}>
                    <SelectTrigger className="brutalist-select">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                      <SelectItem value="inspirational">Inspirational</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platforms" className="text-sm font-bold uppercase">Platforms</Label>
                  <Select value={config.platforms} onValueChange={(value) => value && updateConfig({ platforms: value })}>
                    <SelectTrigger className="brutalist-select">
                      <SelectValue placeholder="Select platforms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="all">All Platforms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numPosts" className="text-sm font-bold uppercase">Number of Posts</Label>
                  <Input
                    id="numPosts"
                    type="number"
                    min="1"
                    max="10"
                    value={config.numPosts}
                    onChange={(e) => updateConfig({ numPosts: parseInt(e.target.value) })}
                    className="brutalist-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numIdeas" className="text-sm font-bold uppercase">Number of Ideas</Label>
                  <Input
                    id="numIdeas"
                    type="number"
                    min="1"
                    max="20"
                    value={config.numIdeas}
                    onChange={(e) => updateConfig({ numIdeas: parseInt(e.target.value) })}
                    className="brutalist-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInstructions" className="text-sm font-bold uppercase">Additional Instructions</Label>
                  <Textarea
                    id="additionalInstructions"
                    value={config.additionalInstructions}
                    onChange={(e) => updateConfig({ additionalInstructions: e.target.value })}
                    placeholder="Any specific instructions for content generation..."
                    className="brutalist-textarea min-h-25"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full brutalist-button"
                >
                  {loading ? "Generating..." : "Generate Content"}
                </Button>
              </form>
            </div>
          </div>
        </div>
        <div className="lg:col-span-3">
          {localResult ? (
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-black p-1 rounded-none h-12">
                <TabsTrigger value="posts" className="font-black uppercase text-sm data-[state=active]:bg-primary data-[state=active]:text-white rounded-none">Posts</TabsTrigger>
                <TabsTrigger value="ideas" className="font-black uppercase text-sm data-[state=active]:bg-primary data-[state=active]:text-white rounded-none">Ideas</TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-6 outline-none">
                <ScrollArea className="h-150 pr-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {localResult.posts.map((p: Post, i: number) => (
                      <div key={i} className="twitter-tweet-card">
                        <div className="twitter-tweet-header">
                          <div className="twitter-avatar bg-gray-300 flex items-center justify-center">
                            <PlatformIcon platform={p.platform} size={20} />
                          </div>
                          <div className="twitter-user-info">
                            <div className="flex items-center">
                              <span className="twitter-display-name">{p.platform}</span>
                              <span className={`twitter-tweet-type ${p.status}`}>
                                {p.status}
                              </span>
                            </div>
                            <div className="twitter-username">Generated content</div>
                          </div>
                        </div>

                        <div className="twitter-tweet-text">{p.content}</div>

                        {p.imageFilename && (
                          <div className="mb-3 relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={p.imageFilename}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )} 

                        <div className="flex items-center justify-between mt-3">
                          {editingId === p._id ? (
                            <div className="flex gap-2">
                              <Button size="sm" className="brutalist-button text-xs" onClick={() => saveEdit(p._id)}>Save</Button>
                              <Button size="sm" variant="outline" className="brutalist-button text-xs" onClick={cancelEdit}>Cancel</Button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <CopyButton text={p.content} />
                              {p.status !== 'posted' && (
                                <Button size="sm" className="brutalist-button text-xs" onClick={() => startEdit(p)}>Edit</Button>
                              )}
                            </div>
                          )}

                          {p.scheduledFor && (
                            <div className="twitter-tweet-date text-xs">
                              Scheduled: {p.scheduledFor}
                            </div>
                          )}
                        </div>

                        {editingId === p._id && (
                          <div className="mt-3 space-y-2">
                            <textarea
                              value={editingContent}
                              onChange={(e) => setEditingContent(e.target.value)}
                              className="w-full h-24 p-2 border border-gray-300 rounded text-sm"
                              placeholder="Edit content..."
                            />
                            <input
                              type="datetime-local"
                              value={editingScheduledFor || ''}
                              onChange={(e) => setEditingScheduledFor(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="ideas" className="outline-none">
                <div className="brutalist-card">
                  <div className="flex flex-row items-center justify-between bg-muted border-b-2 border-black p-6">
                    <h4 className="text-lg brutalist-heading">Content Ideas</h4>
                    {localResult.ideas && <CopyButton text={localResult.ideas.join('\n')} className="brutalist-button h-9" />}
                  </div>
                  <div className="p-8">
                    <ul className="space-y-4">
                      {localResult.ideas?.map((idea: string, i: number) => (
                        <li key={i} className="flex gap-4 text-sm p-5 bg-muted/10 brutalist-card hover:bg-muted/20 transition-all group">
                          <span className="shrink-0 w-10 h-10 border-2 border-black bg-primary text-white flex items-center justify-center font-black text-sm">{i + 1}</span>
                          <span className="pt-2 leading-relaxed font-bold text-base">{idea}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : null}
        </div>
      </div>
    </div>
  );
}