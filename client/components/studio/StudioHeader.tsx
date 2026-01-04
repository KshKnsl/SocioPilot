"use client";

import { Button } from "@/components/ui/button";
import { Trash, CircleNotch, Sparkle } from "@phosphor-icons/react";
import { HistoryDialog } from "./HistoryDialog";

interface StudioHeaderProps {
  loading: boolean;
  onGenerate: () => void;
  onClear: () => void;
  hasResult: boolean;
  isGenerateDisabled: boolean;
  history: any[];
  currentResultId?: string;
  onSelectHistoryItem: (item: any) => void;
  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean) => void;
}

export function StudioHeader({
  loading,
  onGenerate,
  onClear,
  hasResult,
  isGenerateDisabled,
  history,
  currentResultId,
  onSelectHistoryItem,
  isHistoryOpen,
  setIsHistoryOpen
}: StudioHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl brutalist-heading">Content Studio</h1>
        <p className="text-muted-foreground font-medium">Generate or browse your social media library.</p>
      </div>
      <div className="flex gap-3">
        <HistoryDialog 
          isOpen={isHistoryOpen}
          onOpenChange={setIsHistoryOpen}
          history={history}
          currentResultId={currentResultId}
          onSelectResult={onSelectHistoryItem}
        />

        {hasResult && (
          <Button variant="outline" onClick={onClear} className="brutalist-button">
            <Trash size={18} className="mr-2" /> Clear
          </Button>
        )}
        <Button 
          onClick={onGenerate} 
          disabled={isGenerateDisabled} 
          className="bg-primary hover:bg-primary/90 text-white brutalist-button px-6"
        >
          {loading ? <CircleNotch size={18} className="mr-2 animate-spin" /> : <Sparkle size={18} className="mr-2" />}
          {loading ? 'Generating...' : 'Generate New'}
        </Button>
      </div>
    </div>
  );
}
