"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy } from "@phosphor-icons/react";

interface GenerationResultsProps {
  result: any;
  onCopy: (text: string) => void;
}

import { useState, useEffect } from "react";
import { updatePost } from "@/lib/api";
import PlatformIcon from "./PlatformIcon";
import { toast } from "sonner";

export function GenerationResults({ result, onCopy }: GenerationResultsProps) {
  if (!result) return null;

  const [localResult, setLocalResult] = useState(result);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingScheduledFor, setEditingScheduledFor] = useState("");

  useEffect(() => setLocalResult(result), [result]);

  const startEdit = (post: any) => {
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
        posts: prev.posts.map((p: any) => p._id === postId ? { ...p, content: editingContent, scheduledFor: payload.scheduledFor } : p)
      }));
      cancelEdit();
      toast.success("Post updated successfully!");
    } catch (e: any) {
      toast.error(e.message || 'Update failed');
    }
  };

  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8 bg-black p-1 rounded-none h-12">
        <TabsTrigger value="posts" className="font-black uppercase text-sm data-[state=active]:bg-primary data-[state=active]:text-white rounded-none">Posts</TabsTrigger>
        <TabsTrigger value="ideas" className="font-black uppercase text-sm data-[state=active]:bg-primary data-[state=active]:text-white rounded-none">Ideas</TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="space-y-6 outline-none">
        <ScrollArea className="h-150 pr-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {localResult.posts.map((p: any, i: number) => (
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
                      src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/images/${p.imageFilename}`}
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
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => onCopy(p.content)}>
                        <Copy size={14} weight="bold" className="mr-1" /> Copy
                      </Button>
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
        <Card className="brutalist-card">
          <CardHeader className="flex flex-row items-center justify-between bg-muted border-b-2 border-black">
            <CardTitle className="text-lg brutalist-heading">Content Ideas</CardTitle>
            <Button variant="outline" size="sm" className="brutalist-button h-9" onClick={() => onCopy(result.ideas.join('\n'))}><Copy size={16} weight="bold" className="mr-2" /> Copy All</Button>
          </CardHeader>
          <CardContent className="p-8">
            <ul className="space-y-4">
              {result.ideas.map((idea: string, i: number) => (
                <li key={i} className="flex gap-4 text-sm p-5 bg-muted/10 brutalist-card hover:bg-muted/20 transition-all group">
                  <span className="shrink-0 w-10 h-10 border-2 border-black bg-primary text-white flex items-center justify-center font-black text-sm">{i + 1}</span>
                  <span className="pt-2 leading-relaxed font-bold text-base">{idea}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
