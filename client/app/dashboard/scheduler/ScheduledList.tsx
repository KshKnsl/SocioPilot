"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPosts, updatePost } from "@/lib/api";
import PlatformIcon from "@/components/PlatformIcon";
import { toast } from "sonner";

export default function ScheduledList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      const scheduled = data.filter((p: any) => p.status === 'scheduled' || !!p.scheduledFor);
      setPosts(scheduled);
    } catch (e) {
      toast.error("Failed to fetch scheduled posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const onEditStart = (id: string) => {
    setPosts(prev => prev.map(p => p._id === id ? { ...p, editing: true, editingScheduledFor: p.scheduledFor } : p));
  };

  const onSave = async (p: any) => {
    try {
      const payload: any = {};
      payload.scheduledFor = p.editingScheduledFor || null;
      await updatePost(p._id, payload);
      await fetch();
      toast.success("Post updated successfully!");
    } catch (e: any) { 
      toast.error(e.message || 'Update failed'); 
    }
  };

  const onCancel = (id: string) => fetch();

  if (loading) return <div className="p-6">Loading...</div>;

  if (posts.length === 0) return <div className="p-6">No scheduled posts</div>;

  return (
    <div className="space-y-4">
      {posts.map(p => (
        <Card key={p._id} className="brutalist-card">
          <CardHeader className="flex items-center justify-between bg-muted border-b-2 border-black p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-white p-1.5 border-2 border-black"><PlatformIcon platform={p.platform} size={16} /></div>
              <div>
                <div className="text-xs font-black uppercase text-primary">{p.brand?.title}</div>
                <div className="text-xs font-bold uppercase">{p.platform}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm font-bold">{p.scheduledFor ? new Date(p.scheduledFor).toLocaleString() : 'Not scheduled'}</div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="mb-4 whitespace-pre-wrap">{p.content}</div>
            {p.scheduledFor && (
              <div className="text-xs text-muted-foreground">Raw scheduled date: {p.scheduledFor}</div>
            )}
            {p.editing ? (
              <div className="flex items-center gap-2">
                <input type="datetime-local" value={p.editingScheduledFor || ''} onChange={(e) => setPosts(prev => prev.map(x => x._id === p._id ? { ...x, editingScheduledFor: e.target.value } : x))} className="border-2 border-black p-2" />
                <Button size="sm" className="brutalist-button" onClick={() => onSave(p)}>Save</Button>
                <Button size="sm" variant="outline" className="brutalist-button" onClick={() => onCancel(p._id)}>Cancel</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button size="sm" className="brutalist-button" onClick={() => onEditStart(p._id)}>Edit Schedule</Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}