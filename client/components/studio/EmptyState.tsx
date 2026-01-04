"use client";

import { Button } from "@/components/ui/button";
import { Sparkle } from "@phosphor-icons/react";

interface EmptyStateProps {
  onGenerate: () => void;
  disabled: boolean;
}

export function EmptyState({ onGenerate, disabled }: EmptyStateProps) {
  return (
    <div className="h-150 flex flex-col items-center justify-center border-4 border-black border-dashed p-12 text-center space-y-6 bg-background">
      <div className="bg-primary border-2 border-black p-6 brutalist-shadow">
        <Sparkle size={40} weight="bold" className="text-white" />
      </div>
      <div className="space-y-2">
        <h3 className="text-3xl brutalist-heading">Ready to create?</h3>
        <p className="text-muted-foreground max-w-sm mx-auto text-lg font-medium">
          Select a brand, configure your settings, and let AI craft your next viral campaign.
        </p>
      </div>
      <Button 
        onClick={onGenerate} 
        disabled={disabled} 
        size="lg" 
        className="bg-primary text-white brutalist-button px-8"
      >
        Get Started
      </Button>
    </div>
  );
}
