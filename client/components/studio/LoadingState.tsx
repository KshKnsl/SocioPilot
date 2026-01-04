"use client";

import { CircleNotch, Sparkle } from "@phosphor-icons/react";

export function LoadingState() {
  return (
    <div className="h-150 flex flex-col items-center justify-center space-y-6 bg-background border-4 border-black">
      <div className="relative">
        <CircleNotch size={64} weight="bold" className="animate-spin text-primary" />
        <Sparkle size={24} weight="bold" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-2xl brutalist-heading">Crafting your content...</p>
        <p className="text-muted-foreground font-medium animate-pulse uppercase text-xs">
          This may take a minute depending on your configuration.
        </p>
      </div>
    </div>
  );
}
