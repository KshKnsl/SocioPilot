"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy } from "@phosphor-icons/react";

interface GenerationResultsProps {
  result: any;
  onCopy: (text: string) => void;
}

export function GenerationResults({ result, onCopy }: GenerationResultsProps) {
  if (!result) return null;

  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8 bg-black p-1 rounded-none h-12">
        <TabsTrigger value="posts" className="font-black uppercase text-sm data-[state=active]:bg-primary data-[state=active]:text-white rounded-none">Posts</TabsTrigger>
        <TabsTrigger value="ideas" className="font-black uppercase text-sm data-[state=active]:bg-primary data-[state=active]:text-white rounded-none">Ideas</TabsTrigger>
        <TabsTrigger value="topics" className="font-black uppercase text-sm data-[state=active]:bg-primary data-[state=active]:text-white rounded-none">Topics</TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="space-y-6 outline-none">
        <ScrollArea className="h-150 pr-4">
          {result.posts.map((p: any, i: number) => (
            <Card key={i} className="mb-8 brutalist-card overflow-hidden">
              <div className="h-2 bg-primary w-full border-b-2 border-black" />
              <CardHeader className="flex flex-row items-center justify-between py-4 px-6 bg-muted border-b-2 border-black">
                <Badge className="brutalist-badge bg-white text-black">{p.platform}</Badge>
                <Button variant="ghost" size="icon" className="h-9 w-9 border-2 border-transparent hover:border-black transition-colors rounded-none" onClick={() => onCopy(p.content)}><Copy size={18} weight="bold" /></Button>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <p className="text-lg font-bold leading-relaxed whitespace-pre-wrap text-foreground/90">{p.content}</p>
                {p.imageFilename && (
                  <div className="relative aspect-video brutalist-card group overflow-hidden">
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/images/${p.imageFilename}`} 
                      alt="AI Generated Content" 
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" className="brutalist-button bg-white text-black" onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/images/${p.imageFilename}`, '_blank')}>
                        View Full Image
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </TabsContent>

      <TabsContent value="ideas" className="outline-none">
        <Card className="brutalist-card">
          <CardHeader className="flex flex-row items-center justify-between bg-muted border-b-2 border-black">
            <CardTitle className="text-lg brutalist-heading">Content Ideas</CardTitle>
            <Button variant="outline" size="sm" className="brutalist-button h-9" onClick={() => onCopy(result.ideas.join('\n'))}><Copy size={16} weight="bold" className="mr-2" /> Copy All</Button>
          </CardHeader>
          <CardContent className="p-8">
            <ul className="space-y-4">
              {result.ideas.map((idea: string, i: number) => (
                <li key={i} className="flex gap-4 text-sm p-5 bg-muted/10 brutalist-card hover:bg-muted/20 transition-all group">
                  <span className="shrink-0 w-10 h-10 border-2 border-black bg-primary text-white flex items-center justify-center font-black text-sm">{i + 1}</span>
                  <span className="pt-2 leading-relaxed font-bold text-base">{idea}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="topics" className="outline-none">
        <Card className="brutalist-card">
          <CardHeader className="flex flex-row items-center justify-between bg-muted border-b-2 border-black">
            <CardTitle className="text-lg brutalist-heading">Generated Topics</CardTitle>
            <Button variant="outline" size="sm" className="brutalist-button h-9" onClick={() => onCopy(result.topics.join('\n'))}><Copy size={16} weight="bold" className="mr-2" /> Copy All</Button>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-wrap gap-4">
              {result.topics.map((topic: string, i: number) => (
                <Badge key={i} variant="secondary" className="px-6 py-3 text-sm brutalist-badge bg-white text-black hover:bg-primary hover:text-white transition-colors cursor-default brutalist-shadow">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
