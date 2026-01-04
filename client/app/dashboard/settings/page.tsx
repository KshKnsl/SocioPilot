"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, Globe, Sparkle, CheckCircle, TwitterLogo, FacebookLogo, InstagramLogo, LinkedinLogo } from "@phosphor-icons/react";
import { getProviderKeys, setProviderKey } from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();

  const PROVIDERS = [
    { id: 'openai', label: 'OpenAI API Key', placeholder: 'sk-...' },
    { id: 'groq', label: 'Groq API Key', placeholder: 'gsk_...' },
    { id: 'gemini', label: 'Gemini API Key', placeholder: 'AIza...' },
    { id: 'grok', label: 'Grok API Key', placeholder: 'gk-...' },
  ];

  const [keys, setKeys] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const res = await getProviderKeys();
        setKeys(res || {});
      } catch (e: any) {
        console.error(e);
        if (e.message.includes('401')) {
          localStorage.removeItem('sp_token');
          router.push('/login');
        }
      }
    };
    fetchKeys();
  }, [router]);

  const updateKey = (id: string, value: string) => {
    setKeys(prev => ({ ...prev, [id]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      const ops = Object.entries(keys).map(([provider, key]) => (key ? setProviderKey(provider, key) : Promise.resolve()));
      await Promise.all(ops);
      window.dispatchEvent(new Event('storage'));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      console.error(e);
      if (e.message.includes('401')) {
        localStorage.removeItem('sp_token');
        router.push('/login');
      } else {
        alert('Failed to save keys');
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
              {[
                { name: 'Twitter / X', icon: TwitterLogo, color: 'bg-[#1DA1F2]' },
                { name: 'Facebook', icon: FacebookLogo, color: 'bg-[#1877F2]' },
                { name: 'Instagram', icon: InstagramLogo, color: 'bg-[#E4405F]' },
                { name: 'LinkedIn', icon: LinkedinLogo, color: 'bg-[#0A66C2]' },
              ].map((platform) => (
                <div key={platform.name} className="flex items-center justify-between p-4 border-2 border-black bg-background">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${platform.color} border-2 border-black flex items-center justify-center text-white`}>
                      <platform.icon size={20} weight="bold" />
                    </div>
                    <span className="font-black uppercase text-sm">{platform.name}</span>
                  </div>
                  <Button variant="outline" className="brutalist-button text-xs h-8">Connect</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
