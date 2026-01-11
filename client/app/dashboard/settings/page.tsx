"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Key, Globe, Sparkle, CheckCircle, TwitterLogo, Building } from "@phosphor-icons/react";
import { setProviderKey, updateUserBrand } from "@/lib/api";
import { useStudioConfig } from "@/lib/hooks/useStudioConfig";
import { PROVIDERS, TONES } from '@/lib/consts';
export default function SettingsPage() {
  const router = useRouter();
  const { config, updateConfig, hasKey } = useStudioConfig();


  const [keys, setKeys] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [brand, setBrand] = useState({ title: '', description: '', style: [] as string[] });

  useEffect(() => {
    const mapped = Object.fromEntries(PROVIDERS.map(p => [p.id, hasKey(p.id) ? '********' : '']));
    setKeys(mapped);
  }, [router]);

  const updateKey = (id: string, value: string) => {
    setKeys(prev => ({ ...prev, [id]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      const ops = Object.entries(keys).map(([provider, key]) => (
        (key && key !== '********') ? setProviderKey(provider, key) : Promise.resolve()
      ));
      await Promise.all(ops);
      await updateUserBrand(brand);
      setKeys(prev => Object.fromEntries(Object.keys(prev).map(k => [k, prev[k] && prev[k] !== '********' ? '********' : ''])));
      window.dispatchEvent(new Event('storage'));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      console.error(e);
      if (e.message.includes('401')) {
        localStorage.removeItem('sp_token');
        router.push('/login');
      } else {
        alert('Failed to save');
      }
    }
  };

  return (
    <div className="w-full mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl brutalist-heading">Settings</h1>
          <p className="text-muted-foreground font-medium">Manage your API credentials and platform connections.</p>
        </div>
        <Button onClick={handleSave} className="bg-primary text-white brutalist-button px-8">
          {saved ? <CheckCircle size={20} weight="bold" className="mr-2" /> : <Sparkle size={20} weight="bold" className="mr-2" />}
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="brutalist-card mb-6">
            <CardHeader className="bg-muted border-b-2 border-black">
              <CardTitle className="flex items-center gap-2 font-bold uppercase">
                <Building size={20} weight="bold" />
                Brand Profile
              </CardTitle>
              <CardDescription className="font-medium">Define your brand identity for personalized content generation.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label className="font-black uppercase text-xs">Brand Name</Label>
                <Input
                  placeholder="Your brand name"
                  value={brand.title}
                  onChange={(e) => setBrand(prev => ({ ...prev, title: e.target.value }))}
                  className="brutalist-input"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-black uppercase text-xs">Brand Description</Label>
                <Textarea
                  placeholder="Describe your brand, its mission, values, and target audience..."
                  value={brand.description}
                  onChange={(e) => setBrand(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-20 brutalist-input"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-black uppercase text-xs">Style Keywords</Label>
                <Input
                  placeholder="e.g., modern, friendly, professional (comma-separated)"
                  value={brand.style.join(', ')}
                  onChange={(e) => setBrand(prev => ({ ...prev, style: e.target.value.split(',').map(s => s.trim()) }))}
                  className="brutalist-input"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="brutalist-card mb-6">
            <CardHeader className="bg-muted border-b-2 border-black">
              <CardTitle className="flex items-center gap-2 font-bold uppercase">
                <Sparkle size={20} weight="bold" />
                Content Preferences
              </CardTitle>
              <CardDescription className="font-medium">Customize your content tone and voice for better brand alignment.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label className="font-black uppercase text-xs">Tone</Label>
                <Select value={config.tone} onValueChange={(v) => updateConfig({ tone: v })}>
                  <SelectTrigger className="brutalist-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black rounded-none">
                    {TONES.map((tone) => (
                      <SelectItem key={tone} value={tone} className="font-bold uppercase text-xs">
                        {tone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-black uppercase text-xs">Brand Voice</Label>
                <Textarea
                  placeholder="Describe your brand's voice (e.g., friendly, authoritative, conversational...)"
                  value={config.voice}
                  onChange={(e) => updateConfig({ voice: e.target.value })}
                  className="min-h-20 brutalist-input"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="brutalist-card">
            <CardHeader className="bg-muted border-b-2 border-black">
              <CardTitle className="flex items-center gap-2 font-bold uppercase">
                <Key size={20} weight="bold" />
                AI Engine Credentials
              </CardTitle>
              <CardDescription className="font-medium">Your API keys are stored securely on your account (server-side).</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PROVIDERS.map((p) => (
                  <div key={p.id} className="space-y-2">
                    <Label className="font-black uppercase text-xs">{p.label}</Label>
                    <Input
                      type="password"
                      placeholder={p.placeholder}
                      value={keys[p.id] || ''}
                      onChange={(e) => updateKey(p.id, e.target.value)}
                      className="brutalist-input"
                    />
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase">Keys are stored server-side and accessible only to your account. Empty fields are ignored when saving.</p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="brutalist-card">
            <CardHeader className="bg-muted border-b-2 border-black">
              <CardTitle className="flex items-center gap-2 font-bold uppercase">
                <Globe size={20} weight="bold" />
                Platform Connections
              </CardTitle>
              <CardDescription className="font-medium">Connect your social media accounts for direct publishing.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between p-4 border-2 border-black bg-background">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-[#1DA1F2] border-2 border-black flex items-center justify-center text-white`}>
                    <TwitterLogo size={20} weight="bold" />
                  </div>
                  <span className="font-black uppercase text-sm">Twitter / X</span>
                </div>
                <Button variant="outline" className="brutalist-button text-xs h-8">Connect</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
