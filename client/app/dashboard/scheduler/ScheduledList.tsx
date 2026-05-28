"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getPosts, updatePost } from "@/lib/api";
import PlatformIcon from "@/components/PlatformIcon";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/utils";
import { Post } from "@/lib/types";

export default function ScheduledList() {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetch = async () => {
    try {
      const data = await getPosts();
      const scheduled = data.filter((p: Post) => p.status === 'scheduled' || !!p.scheduledFor);
      setPosts(scheduled);
    } catch (e) {
      toast.error("Failed to fetch scheduled posts");
    }
  };

  useEffect(() => { fetch(); }, []);

  const onEditStart = (id: string) => {
    setPosts(prev => prev.map(p => p._id === id ? { ...p, editing: true, editingScheduledFor: p.scheduledFor } : p));
  };

  const onSave = async (p: Post) => {
    try {
      const payload: Partial<Post> = {};
      payload.scheduledFor = p.editingScheduledFor || undefined;
      await updatePost(p._id, payload);
      await fetch();
      toast.success("Post updated successfully!");
    } catch (e: any) { 
      toast.error(e.message || 'Update failed'); 
    }
  };

  const onCancel = (id: string) => fetch();

  if (posts.length === 0) return <div className="p-6">No scheduled posts</div>;

  return (
    <div className="space-y-4">
      {posts.map(p => (
        <div key={p._id} className="brutalist-card">
          <div className="flex items-center justify-between bg-muted border-b-2 border-black p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-white p-1.5 border-2 border-black"><PlatformIcon platform={p.platform} size={16} /></div>
              <div>
                <div className="text-xs font-black uppercase text-primary">{p.brand?.title}</div>
                <div className="text-xs font-bold uppercase">{p.platform}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm font-bold">{p.scheduledFor ? formatDateTime(p.scheduledFor) : 'Not scheduled'}</div>
            </div>
          </div>
          <div className="p-4">
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
          </div>
        </div>
      ))}
    </div>
  );
}