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
      <DialogContent className="sm:max-w-125 border-2 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <DialogHeader className="border-b-2 border-black pb-4">
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Create New Brand</DialogTitle>
          <DialogDescription className="font-medium">Define your brand identity and writing style.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-6">
          <div className="space-y-2">
            <Label className="font-black uppercase text-xs">Brand Name</Label>
            <Input placeholder="e.g. TechFlow" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-primary" />
          </div>
          <div className="space-y-2">
            <Label className="font-black uppercase text-xs">Description</Label>
            <Textarea placeholder="What does your brand do?" className="min-h-25 border-2 border-black rounded-none focus-visible:ring-0 focus-visible:border-primary" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="space-y-3">
            <Label className="font-black uppercase text-xs">Writing Styles</Label>
            <ScrollArea className="h-37.5 w-full border-2 border-black p-4 bg-muted/10">
              <div className="flex flex-wrap gap-2">
                {writingStyles.map(s => (
                  <Badge 
                    key={s} 
                    variant={form.styles.includes(s) ? "default" : "outline"} 
                    className={`cursor-pointer px-3 py-1 border-2 rounded-none font-bold uppercase text-[10px] ${form.styles.includes(s) ? 'border-black' : 'border-black/20'}`} 
                    onClick={() => toggleStyle(s)}
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter className="border-t-2 border-black pt-4">
          <Button variant="outline" onClick={() => setOpen(false)} className="border-2 border-black rounded-none font-bold uppercase">Cancel</Button>
          <Button 
            onClick={onCreate} 
            disabled={loading || !form.title || !form.description} 
            className="bg-primary text-white border-2 border-black rounded-none font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            {loading && <CircleNotch className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Creating...' : 'Create Brand'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
