"use client";

import { Button } from "@/components/ui/button";
import { CopyIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

export function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-8 px-2 text-xs ${className}`}
      onClick={handleCopy}
    >
      <CopyIcon size={14} weight="bold" className="mr-1" />
      Copy
    </Button>
  );
}