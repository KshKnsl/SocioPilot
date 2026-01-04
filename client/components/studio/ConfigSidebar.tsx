"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Robot, Gear, Image as ImageIcon, ListBullets, Sparkle } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useStudioConfig } from "@/lib/hooks/useStudioConfig";
import PlatformIcon from "./PlatformIcon";

const MODELS = [
  { id: 'gpt-4o-mini', provider: 'openai' },
  { id: 'gpt-4', provider: 'openai' },
  { id: 'gpt-3.5-turbo', provider: 'openai' },
  { id: 'groq:meta-llama/llama-guard-4-12b', provider: 'groq' },
  { id: 'groq:openai/gpt-oss-120b', provider: 'groq' },
  { id: 'groq:openai/gpt-oss-20b', provider: 'groq' },
  { id: 'gemini-2.5-flash', provider: 'gemini' },
  { id: 'gemini-2.5-pro', provider: 'gemini' },
  { id: 'claude-3-5-sonnet-latest', provider: 'grok' },
  { id: 'grok:grok-4-latest', provider: 'grok' },
];

export function ConfigSidebar() {
  const router = useRouter();
  const { config, updateConfig, hasKey, hasAnyKey } = useStudioConfig();

  const availableModels = MODELS.filter(m => {
    return hasKey(m.provider as string);
  });

  const currentModel = config.model || (availableModels.length > 0 ? availableModels[0].id : 'gpt-4o-mini');

  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 gap-4">
        <Button 
          onClick={() => router.push('/dashboard')} 
          variant={'default'}
          className={`brutalist-button h-12 text-lg font-black uppercase bg-primary text-white`}
        >
          <Sparkle size={20} weight="bold" className="mr-2" />
          Studio
        </Button>
      </div>

      {!hasAnyKey && (
        <Card className="brutalist-card bg-primary/5">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary border-2 border-black flex items-center justify-center text-white">
                <Gear size={20} weight="bold" className="animate-spin-slow" />
              </div>
              <div>
                <p className="font-black uppercase text-[10px]">API Keys Missing</p>
                <p className="text-[9px] text-muted-foreground font-bold uppercase">Configure in settings</p>
              </div>
            </div>
            <Button onClick={() => router.push('/dashboard/settings')} className="w-full brutalist-button bg-white text-[10px] h-8">
              Go to Settings
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="brutalist-card">
        <CardHeader className="bg-muted border-b-2 border-black pb-4">
          <CardTitle className="text-lg font-bold uppercase">Configuration</CardTitle>
          <CardDescription className="font-medium">Fine-tune your generation engine.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Robot size={14} weight="bold" />
              AI Model
            </Label>
            <Select value={currentModel as any} onValueChange={(v) => updateConfig({ model: v })}>
              <SelectTrigger className="brutalist-input font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-2 border-black rounded-none">
                {availableModels.length === 0 ? (
                  <div className="p-2 text-[10px] font-bold uppercase text-muted-foreground">No API keys configured</div>
                ) : (
                  availableModels.map((m) => (
                    <SelectItem key={m.id} value={m.id} className="font-bold uppercase text-xs">
                      {m.id}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Topics</Label>
              <Input type="number" value={config.topicCount} onChange={(e) => updateConfig({ topicCount: Number(e.target.value) })} className="brutalist-input" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Ideas/Topic</Label>
              <Input type="number" value={config.ideasPerTopic} onChange={(e) => updateConfig({ ideasPerTopic: Number(e.target.value) })} className="brutalist-input" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Language</Label>
            <Input value={config.language} onChange={(e) => updateConfig({ language: e.target.value })} className="brutalist-input" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Topics Prompt Expansion</Label>
            <Textarea 
              placeholder="Extra instructions for topic generation..." 
              value={config.topicsPromptExpansion} 
              onChange={(e) => updateConfig({ topicsPromptExpansion: e.target.value })} 
              className="min-h-20 brutalist-input"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Posts Prompt Expansion</Label>
            <Textarea 
              placeholder="Extra instructions for post generation..." 
              value={config.postsPromptExpansion} 
              onChange={(e) => updateConfig({ postsPromptExpansion: e.target.value })} 
              className="min-h-20 brutalist-input"
            />
          </div>

          <Separator className="bg-black h-0.5" />

          <div className="space-y-3">
            <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Platforms</Label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(config.platforms).map((p) => (
                <Badge 
                  key={p} 
                  variant={config.platforms[p as keyof typeof config.platforms] ? "default" : "outline"}
                  className={`cursor-pointer brutalist-badge ${config.platforms[p as keyof typeof config.platforms] ? 'bg-primary text-white' : 'border-black/20'} flex items-center gap-2`}
                  onClick={() => updateConfig({ platforms: { ...config.platforms, [p]: !config.platforms[p as keyof typeof config.platforms] } })}
                >
                  <PlatformIcon platform={p} size={14} />
                  <span className="text-xs font-bold uppercase">{p}</span>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground">AI Images</Label>
            <Button 
              variant={config.generateImages ? "default" : "outline"} 
              size="sm" 
              onClick={() => updateConfig({ generateImages: !config.generateImages })}
              className={`brutalist-button h-9 ${config.generateImages ? 'bg-primary text-white' : ''}`}
            >
              <ImageIcon size={16} weight="bold" className="mr-2" /> {config.generateImages ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
