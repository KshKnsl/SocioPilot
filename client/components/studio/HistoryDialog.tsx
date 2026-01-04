"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClockCounterClockwise, CalendarBlank, CaretRight } from "@phosphor-icons/react";

interface HistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  history: any[];
  currentResultId?: string;
  onSelectResult: (result: any) => void;
}

export function HistoryDialog({ isOpen, onOpenChange, history, currentResultId, onSelectResult }: HistoryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <Button variant="outline" className="brutalist-button">
          <ClockCounterClockwise size={18} className="mr-2" />
          History
          <Badge className="ml-2 bg-black text-white brutalist-badge">{history.length}</Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md brutalist-card p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-muted border-b-2 border-black">
          <DialogTitle className="text-xl brutalist-heading flex items-center gap-2">
            <ClockCounterClockwise size={24} weight="bold" />
            Generation History
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-125">
          <div className="p-4 space-y-3">
            {history.length === 0 && (
              <div className="text-center py-12 border-4 border-black border-dashed m-2">
                <p className="text-sm font-bold text-muted-foreground uppercase">No history found</p>
              </div>
            )}
            {history.map((item) => (
              <button
                key={item._id}
                onClick={() => {
                  onSelectResult(item);
                  onOpenChange(false);
                }}
                className={`w-full text-left p-4 brutalist-button bg-background group ${
                  (currentResultId === item._id) ? 'bg-primary/5 ring-2 ring-primary' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                    {item.brand?.title || 'Brand'}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
                    <CalendarBlank size={12} weight="bold" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-sm font-black line-clamp-1 group-hover:text-primary transition-colors mb-3 uppercase">
                  {item.topics?.[0] || 'Untitled Generation'}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      {item.posts?.slice(0, 3).map((_: any, i: number) => (
                        <div key={i} className="w-5 h-5 bg-primary border-2 border-black flex items-center justify-center">
                          <div className="w-1 h-1 bg-white" />
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-black uppercase">
                      {item.posts?.length || 0} posts
                    </span>
                  </div>
                  <CaretRight size={16} weight="bold" className="text-primary" />
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
