"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { defaultStyles, writingStyles } from "@/lib/styleOptions";
import { createBrand } from "@/lib/api";
import { CircleNotch } from "@phosphor-icons/react";

export default function NewBrandDialog({ open, setOpen, onCreated }: { open: boolean; setOpen: (v: boolean) => void; onCreated?: () => void }) {
  const [form, setForm] = useState({ title: "", description: "", styles: defaultStyles });
  const [loading, setLoading] = useState(false);

  async function onCreate() {
    setLoading(true);
    try {
      const res = await createBrand({ ...form, style: form.styles });
      setForm({ title: "", description: "", styles: defaultStyles });
      if (res?._id) { 
        localStorage.setItem("sp_selected_brand", res._id); 
        window.dispatchEvent(new Event("storage")); 
      }
      if (onCreated) onCreated();
      setOpen(false);
    } catch (e) { alert("Failed to create brand"); } finally { setLoading(false); }
  }

  const toggleStyle = (s: string) => setForm(f => ({ ...f, styles: f.styles.includes(s) ? f.styles.filter(x => x !== s) : [...f.styles, s] }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader><DialogTitle>Create New Brand</DialogTitle><DialogDescription>Define your brand identity and writing style.</DialogDescription></DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2"><Label>Brand Name</Label><Input placeholder="e.g. TechFlow" className="brutalist-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div className="space-y-2"><Label>Description</Label><Textarea placeholder="What does your brand do?" className="min-h-25 brutalist-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div className="space-y-3"><Label>Writing Styles</Label>
            <ScrollArea className="h-37.5 w-full rounded-none border-2 border-black p-4"><div className="flex flex-wrap gap-2">
              {writingStyles.map(s => (
                <Badge key={s} variant={form.styles.includes(s) ? "default" : "outline"} className="cursor-pointer brutalist-badge px-3 py-1" onClick={() => toggleStyle(s)}>{s}</Badge>
              ))}
            </div></ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="brutalist-button" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={onCreate} disabled={loading || !form.title || !form.description} className="bg-primary brutalist-button">
            {loading && <CircleNotch className="mr-2 h-4 w-4 animate-spin" />}{loading ? 'Creating...' : 'Create Brand'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
