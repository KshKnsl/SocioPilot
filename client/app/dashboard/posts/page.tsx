"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, CalendarBlank, Image as ImageIcon, CircleNotch, ArrowClockwise } from "@phosphor-icons/react";
import { getPosts, updatePost } from "@/lib/api";
import PlatformIcon from "@/components/PlatformIcon";
import { toast } from "sonner";

export default function DashboardPostsPage() {
  const router = useRouter();

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sp_token");
    if (!token) router.push('/login');
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
    } catch (e) {
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const onToggleEdit = (id: string) => {
    setPosts(prev => prev.map(p => p._id === id ? { ...p, editing: true, editingScheduledFor: p.scheduledFor } : p));
  };

  const onSave = async (post: any) => {
    try {
      const payload: any = { content: post.content };
      payload.scheduledFor = post.editingScheduledFor || null;
      await updatePost(post._id, payload);
      await fetchPosts();
      toast.success("Post updated successfully!");
    } catch (e: any) { 
      toast.error(e.message || 'Update failed'); 
    }
  };

  const onCancel = (id: string) => {
    fetchPosts();
  };

  const allPosts = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="max-w-screen-2xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl brutalist-heading uppercase">All Posts</h1>

      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-2xl brutalist-heading uppercase">Your Post Library</h2>
          <div className="flex items-center gap-3">
            {!loading && <Badge className="bg-black text-white brutalist-badge">{allPosts.length} Total Posts</Badge>}
            <Button size="sm" variant="outline" className="brutalist-button h-8" onClick={fetchPosts}>
              <ArrowClockwise size={14} weight="bold" className="mr-2" /> Refresh
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <CircleNotch size={48} weight="bold" className="animate-spin text-primary" />
            <p className="text-sm font-black uppercase text-muted-foreground">Loading your library...</p>
          </div>
        ) : allPosts.length === 0 ? (
          <Card className="brutalist-card border-dashed py-20">
            <CardContent className="text-center">
              <p className="text-muted-foreground font-black uppercase">No posts generated yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allPosts.map((post, idx) => (
              <Card key={post._id} className="brutalist-card overflow-hidden">
                <CardHeader className="bg-muted border-b-2 border-black py-3 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary text-white p-1.5 border-2 border-black">
                        <PlatformIcon platform={post.platform} size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-primary leading-none mb-1">{post.brand.title}</p>
                        <p className="text-xs font-bold uppercase leading-none">{post.platform}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                        <CalendarBlank size={12} weight="bold" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                      <div>
                        <span className={`px-2 py-1 text-xs font-black uppercase rounded-sm border-2 ${post.status === 'posted' ? 'bg-primary text-white' : post.status === 'scheduled' ? 'bg-secondary text-white' : 'bg-white text-black'}`}>
                          {post.status}
                        </span>
                      </div>
                      {post.scheduledFor && (
                        <div className="text-[10px] font-bold text-muted-foreground uppercase">
                          Scheduled: {post.scheduledFor}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {post.editing ? (
                    <div className="space-y-4">
                      <textarea value={post.content} onChange={(e) => {
                        const val = e.target.value;
                        setPosts(prev => prev.map(p => p._id === post._id ? { ...p, content: val } : p));
                      }} className="w-full p-3 border-2 border-black min-h-30" />

                      <div className="flex gap-2 items-center">
                        <label className="text-xs font-bold uppercase">Scheduled For</label>
                        <input type="datetime-local" value={post.editingScheduledFor || ''} onChange={(e) => setPosts(prev => prev.map(p => p._id === post._id ? { ...p, editingScheduledFor: e.target.value } : p))} className="border-2 border-black p-2" />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border-2 border-black p-4 font-medium text-sm whitespace-pre-wrap">
                      {post.content}
                    </div>
                  )}

                  {post.imageFilename && (
                    <div className="relative aspect-video brutalist-card group overflow-hidden">
                      <img 
                        src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/images/${post.imageFilename}`} 
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="secondary" size="sm" className="brutalist-button bg-white text-black" onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/images/${post.imageFilename}`, '_blank')}>
                          View Full Image
                        </Button>
                      </div>
                    </div>
                  )}



                  <div className="flex items-center justify-between pt-2">
                    <div className="text-[10px] font-black uppercase text-muted-foreground">
                      Idea: {post.topic}
                    </div>

                    {post.platformPostId && (
                      <div className="text-xs text-green-700 font-bold">Platform ID: {post.platformPostId}</div>
                    )}

                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="brutalist-button h-8"
                        onClick={() => onCopy(post.content)}
                      >
                        <Copy size={14} weight="bold" className="mr-2" /> Copy Post
                      </Button>
                      {post.editing ? (
                        <>
                          <Button size="sm" className="brutalist-button h-8" onClick={async () => {
                            try {
                              await onSave(post);
                            } catch (e: any) { alert(e.message || 'Update failed'); }
                          }}>Save</Button>
                          <Button size="sm" variant="outline" className="brutalist-button h-8" onClick={() => onCancel(post._id)}>Cancel</Button>
                        </>
                      ) : (
                        post.status !== 'posted' ? (
                          <Button size="sm" className="brutalist-button h-8" onClick={() => onToggleEdit(post._id)}>Edit</Button>
                        ) : (
                          <Button size="sm" variant="outline" className="brutalist-button h-8" disabled>Posted</Button>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}