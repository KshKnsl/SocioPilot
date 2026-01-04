"use client";

import { useState, useEffect } from "react";
import { getBrands } from "@/lib/api";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NewBrandDialog from "../brand/NewBrandDialog";
import { PlusCircle } from "@phosphor-icons/react";

export default function BrandSelector() {
  const [brands, setBrands] = useState<{ _id: string; title: string }[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const refresh = async () => {
    const data = await getBrands();
    setBrands(data);
    const saved = localStorage.getItem("sp_selected_brand");
    const id = saved && data.find((b: any) => b._id === saved) ? saved : data[0]?._id;
    if (id) { 
      setSelectedId(id); 
      if (saved !== id) {
        localStorage.setItem("sp_selected_brand", id);
        window.dispatchEvent(new Event("storage"));
      }
    }
  };

  useEffect(() => {
    refresh();
    const sync = () => { 
      const saved = localStorage.getItem("sp_selected_brand");
      if (saved) setSelectedId(saved);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const onSelect = (id: string | null) => {
    if (!id) return;
    if (id === "__new") return setOpen(true);
    setSelectedId(id);
    localStorage.setItem("sp_selected_brand", id);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <>
      <Select value={selectedId ?? ""} onValueChange={onSelect}>
        <SelectTrigger className="w-full bg-background border-2 border-black rounded-none font-bold">
          <SelectValue>
            {brands.find(b => b._id === selectedId)?.title}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="border-2 border-black rounded-none">
          <SelectGroup>
            {brands.map((b) => (
              <SelectItem key={b._id} value={b._id} className="font-bold uppercase text-xs">
                {b.title}
              </SelectItem>
            ))}
            <SelectItem value="__new" className="text-primary font-black uppercase text-xs border-t-2 border-black mt-1">
              <div className="flex items-center gap-2"><PlusCircle size={16} weight="bold" /> Create new brand</div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <NewBrandDialog open={open} setOpen={setOpen} onCreated={refresh} />
    </>
  );
}
