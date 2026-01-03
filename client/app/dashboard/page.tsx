"use client";

import { useState, useEffect } from "react";
import { generate } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Image as ImageIcon, CircleNotch, Sparkle, Trash } from "@phosphor-icons/react";

const MODELS = [
  'gpt-4o-mini', 'gpt-4', 'gpt-3.5-turbo',
  'groq:llama-3.1-70b-versatile', 'groq:llama-3.1-8b-instant',
  'gemini-2.5-flash'
];

export default function DashboardPage() {
  const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sync = () => setSelectedBrandId(localStorage.getItem("sp_selected_brand") ?? undefined);
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const [result, setResult] = useState<any | null>(null);
  const [config, setConfig] = useState({
    topicCount: 3,
    ideasPerTopic: 2,
    language: "English",
    platforms: { Twitter: true, Facebook: false, Instagram: false, LinkedIn: false },
    generateImages: false,
    model: 'gpt-4o-mini',
    providerKey: '',
    topicsPromptExpansion: '',
    postsPromptExpansion: ''
  });

  useEffect(() => {
    const savedKey = localStorage.getItem("sp_provider_key");
    const savedModel = localStorage.getItem("sp_model");
    const updates: Partial<typeof config> = {};
    if (savedKey) updates.providerKey = savedKey;
    if (savedModel) updates.model = savedModel;
    updateConfig(updates);
  }, []);

  const updateConfig = (updates: Partial<typeof config>) => {
    if (updates.providerKey !== undefined) localStorage.setItem("sp_provider_key", updates.providerKey);
    if (updates.model !== undefined) localStorage.setItem("sp_model", updates.model);
    setConfig(prev => ({ ...prev, ...updates }));
  };

  async function onGenerate() {
    setLoading(true);
    setResult(null);
    try {
      const platformsArr = Object.keys(config.platforms).filter((k) => config.platforms[k as keyof typeof config.platforms]);
      const res = await generate({
        brandId: selectedBrandId,
        ...config,
        platforms: platformsArr,
        providerApiKey: config.providerKey || null
      });
      setResult(res);
    } catch (e) {
      console.error(e);
      alert("Generation failed");
    } finally {
      setLoading(false);
    }
  }

  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Generate high-quality social media content for your brand.</p>
        </div>
        <div className="flex gap-2">
          {result && <Button variant="outline" onClick={() => setResult(null)}><Trash size={18} className="mr-2" /> Clear</Button>}
          <Button onClick={onGenerate} disabled={loading || !selectedBrandId || !config.providerKey} className="bg-primary">
            {loading ? <CircleNotch size={18} className="mr-2 animate-spin" /> : <Sparkle size={18} className="mr-2" />}
            {loading ? 'Generating...' : 'Generate Content'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 border-primary/20 h-fit">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Fine-tune your content generation settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Model & Provider</Label>
              <Select value={config.model ?? ''} onValueChange={(v) => updateConfig({ model: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{MODELS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
              <Input type="password" placeholder="Provider API Key" value={config.providerKey} onChange={(e) => updateConfig({ providerKey: e.target.value })} />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Topics</Label>
                <Input type="number" value={config.topicCount} onChange={(e) => updateConfig({ topicCount: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Ideas/Topic</Label>
                <Input type="number" value={config.ideasPerTopic} onChange={(e) => updateConfig({ ideasPerTopic: Number(e.target.value) })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Input value={config.language} onChange={(e) => updateConfig({ language: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Topics Prompt Expansion</Label>
              <Textarea 
                placeholder="Extra instructions for topic generation..." 
                value={config.topicsPromptExpansion} 
                onChange={(e) => updateConfig({ topicsPromptExpansion: e.target.value })} 
                className="min-h-20"
              />
            </div>

            <div className="space-y-2">
              <Label>Posts Prompt Expansion</Label>
              <Textarea 
                placeholder="Extra instructions for post generation..." 
                value={config.postsPromptExpansion} 
                onChange={(e) => updateConfig({ postsPromptExpansion: e.target.value })} 
                className="min-h-20"
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Platforms</Label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(config.platforms).map((p) => (
                  <Badge 
                    key={p} 
                    variant={config.platforms[p as keyof typeof config.platforms] ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1"
                    onClick={() => updateConfig({ platforms: { ...config.platforms, [p]: !config.platforms[p as keyof typeof config.platforms] } })}
                  >
                    {p}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Label>Generate AI Images</Label>
              <Button variant={config.generateImages ? "default" : "outline"} size="sm" onClick={() => updateConfig({ generateImages: !config.generateImages })}>
                <ImageIcon size={16} className="mr-2" /> {config.generateImages ? "On" : "Off"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {!result && !loading && (
            <div className="h-150 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center space-y-4">
              <div className="bg-primary/10 p-4 rounded-full"><Sparkle size={32} className="text-primary" /></div>
              <h3 className="text-xl font-semibold">No content generated yet</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">Configure your settings and click generate to start creating social media magic.</p>
            </div>
          )}

          {loading && (
            <div className="h-150 flex flex-col items-center justify-center space-y-4">
              <CircleNotch size={48} className="animate-spin text-primary" />
              <p className="text-lg font-medium animate-pulse">Crafting your content...</p>
            </div>
          )}

          {result && (
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="ideas">Ideas</TabsTrigger>
                <TabsTrigger value="topics">Topics</TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-4">
                <ScrollArea className="h-150 pr-4">
                  {result.posts.map((p: any, i: number) => (
                    <Card key={i} className="mb-4 overflow-hidden border-l-4 border-l-primary">
                      <CardHeader className="flex flex-row items-center justify-between py-3 bg-muted/30">
                        <Badge variant="secondary" className="uppercase tracking-wider text-[10px]">{p.platform}</Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copy(p.content)}><Copy size={16} /></Button>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-4 text-sm leading-relaxed">
                        <p className="whitespace-pre-wrap">{p.content}</p>
                        {p.imageFilename && (
                          <div className="relative aspect-video rounded-md overflow-hidden border">
                            <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/images/${p.imageFilename}`} alt="AI" className="object-cover w-full h-full" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="ideas">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Content Ideas</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => copy(result.ideas.join('\n'))}><Copy size={16} className="mr-2" /> Copy All</Button>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {result.ideas.map((idea: string, i: number) => (
                        <li key={i} className="flex gap-3 text-sm p-3 rounded-md bg-muted/50 border"><span className="font-bold text-primary">{i + 1}.</span>{idea}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="topics">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Generated Topics</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => copy(result.topics.join('\n'))}><Copy size={16} className="mr-2" /> Copy All</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.topics.map((topic: string, i: number) => <Badge key={i} variant="secondary" className="px-3 py-1 text-sm">{topic}</Badge>)}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}

