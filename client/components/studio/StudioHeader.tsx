"use client";

import { Button } from "@/components/ui/button";
import { Trash, CircleNotch, Sparkle } from "@phosphor-icons/react";
interface StudioHeaderProps {
  loading: boolean;
  onGenerate: () => void;
  onClear: () => void;
  hasResult: boolean;
}

export function StudioHeader({
  loading,
  onGenerate,
  onClear,
  hasResult,
}: StudioHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <div>
        <h1 className="text-4xl brutalist-heading">Content Studio</h1>
        <p className="text-muted-foreground font-medium">Generate or browse your social media library.</p>
      </div>
      <div className="flex gap-3">
        {hasResult && (
          <Button variant="outline" onClick={onClear} className="brutalist-button">
            <Trash size={18} className="mr-2" /> Clear
          </Button>
        )}
        <Button 
          onClick={onGenerate} 
          disabled={loading} 
          className="bg-primary hover:bg-primary/90 text-white brutalist-button px-6"
        >
          {loading ? <CircleNotch size={18} className="mr-2 animate-spin" /> : <Sparkle size={18} className="mr-2" />}
          {loading ? 'Generating...' : 'Generate New'}
        </Button>
      </div>
    </div>
  );
}
