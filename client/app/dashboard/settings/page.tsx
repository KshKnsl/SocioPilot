"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, ShieldCheck, Robot, Globe, ListBullets, Sparkle, Image as ImageIcon, CheckCircle, TwitterLogo, FacebookLogo, InstagramLogo, LinkedinLogo } from "@phosphor-icons/react";

export default function SettingsPage() {
  const [config, setConfig] = useState({
    openaiKey: '',
    groqKey: '',
    geminiKey: '',
    anthropicKey: '',
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setConfig({
      openaiKey: localStorage.getItem("sp_openai_key") || '',
      groqKey: localStorage.getItem("sp_groq_key") || '',
      geminiKey: localStorage.getItem("sp_gemini_key") || '',
      anthropicKey: localStorage.getItem("sp_anthropic_key") || '',
    });
  }, []);

  const updateConfig = (updates: Partial<typeof config>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("sp_openai_key", config.openaiKey);
    localStorage.setItem("sp_groq_key", config.groqKey);
    localStorage.setItem("sp_gemini_key", config.geminiKey);
    localStorage.setItem("sp_anthropic_key", config.anthropicKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl brutalist-heading">Settings</h1>
          <p className="text-muted-foreground font-medium">Manage your API credentials and platform connections.</p>
        </div>
        <Button onClick={handleSave} className="bg-primary text-white brutalist-button px-8">
          {saved ? <CheckCircle size={20} weight="bold" className="mr-2" /> : <Sparkle size={20} weight="bold" className="mr-2" />}
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <Card className="brutalist-card">
        <CardHeader className="bg-muted border-b-2 border-black">
          <CardTitle className="flex items-center gap-2 font-bold uppercase">
            <Key size={20} weight="bold" />
            AI Engine Credentials
          </CardTitle>
          <CardDescription className="font-medium">Your API keys are stored locally and never touch our servers.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-black uppercase text-xs">OpenAI API Key</Label>
              <Input 
                type="password" 
                placeholder="sk-..." 
                value={config.openaiKey} 
                onChange={(e) => updateConfig({ openaiKey: e.target.value })} 
                className="brutalist-input" 
              />
            </div>
            <div className="space-y-2">
              <Label className="font-black uppercase text-xs">Groq API Key</Label>
              <Input 
                type="password" 
                placeholder="gsk_..." 
                value={config.groqKey} 
                onChange={(e) => updateConfig({ groqKey: e.target.value })} 
                className="brutalist-input" 
              />
            </div>
            <div className="space-y-2">
              <Label className="font-black uppercase text-xs">Gemini API Key</Label>
              <Input 
                type="password" 
                placeholder="AIza..." 
                value={config.geminiKey} 
                onChange={(e) => updateConfig({ geminiKey: e.target.value })} 
                className="brutalist-input" 
              />
            </div>
            <div className="space-y-2">
              <Label className="font-black uppercase text-xs">Anthropic API Key</Label>
              <Input 
                type="password" 
                placeholder="sk-ant-..." 
                value={config.anthropicKey} 
                onChange={(e) => updateConfig({ anthropicKey: e.target.value })} 
                className="brutalist-input" 
              />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground font-bold uppercase">Keys are stored in your browser's local storage.</p>
        </CardContent>
      </Card>

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
  );
}
