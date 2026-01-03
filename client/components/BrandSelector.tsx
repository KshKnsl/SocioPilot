"use client";

import { useState, useEffect } from "react";
import { getBrands } from "@/lib/api";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NewBrandDialog from "./NewBrandDialog";
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
    if (id) { setSelectedId(id); localStorage.setItem("sp_selected_brand", id); }
  };

  useEffect(() => {
    refresh();
    const sync = () => { setSelectedId(localStorage.getItem("sp_selected_brand")); refresh(); };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const onSelect = (id: string | null) => {
    if (!id) return;
    if (id === "__new") return setOpen(true);
    localStorage.setItem("sp_selected_brand", id);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <>
      <Select value={selectedId ?? ""} onValueChange={onSelect}>
        <SelectTrigger className="w-50 bg-background border-primary/20"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {brands.map((b) => <SelectItem key={b._id} value={b._id}>{b.title}</SelectItem>)}
            <SelectItem value="__new" className="text-primary font-medium">
              <div className="flex items-center gap-2"><PlusCircle size={16} /> Create new brand</div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <NewBrandDialog open={open} setOpen={setOpen} onCreated={refresh} />
    </>
  );
}
