"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { KeyIcon, GlobeIcon, SparkleIcon, BuildingIcon } from "@phosphor-icons/react";

import { setProviderKey, updateUserBrand, getCurrentUser, startTwitterAuth } from "@/lib/api";

import { PROVIDERS, writingStyles } from '@/lib/consts';
import { toast } from "sonner";
import { Brand } from "@/lib/types";
import PlatformIcon from "@/components/PlatformIcon";

export default function SettingsPage() {
  const { logout, user, twitterConnected } = useAuth();
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [brand, setBrand] = useState<Brand>({ title: '', description: '', style: [] });

  useEffect(() => {
    const mapped = Object.fromEntries(PROVIDERS.map(p => [p.id, '']));
    setKeys(mapped);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getCurrentUser();
        if (data.user.brand) {
          setBrand({
            title: data.user.brand.title || '',
            description: data.user.brand.description || '',
            style: Array.isArray(data.user.brand.style) ? data.user.brand.style : []
          });
        }
      } catch (e) {
        toast.error('Failed to fetch user data');
      }
    };
    fetchUserData();
  }, []);

  const updateKey = (id: string, value: string) => {
    setKeys(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    try {
      const ops = Object.entries(keys).map(([provider, key]) => (
        key ? setProviderKey(provider, key) : Promise.resolve()
      ));
      await Promise.all(ops);
      await updateUserBrand(brand);
      setKeys(prev => Object.fromEntries(Object.keys(prev).map(k => [k, ''])));
      window.dispatchEvent(new Event('storage'));
      toast.success("Settings saved successfully!");
    } catch (e: any) {
      if (e.message.includes('401'))
        logout();
      else
        toast.error("Failed to save settings");
    }
  };

  const handleTwitterConnect = async () => {
    try {
      const data = await startTwitterAuth();
      window.location.href = data.url;
    } catch (e) {
      toast.error("Failed to connect to Twitter");
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
          <SparkleIcon size={20} weight="bold" className="mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="brutalist-card mb-6">
            <div className="bg-muted border-b-2 border-black p-6">
              <h3 className="flex items-center gap-2 font-bold uppercase">
                <BuildingIcon size={20} weight="bold" />
                Brand Profile
              </h3>
              <p className="font-medium mt-2">Define your brand identity for personalized content generation.</p>
            </div>
            <div className="pt-6 space-y-6 p-6">
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
                <Label className="font-black uppercase text-xs">Writing Style Preferences</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border-2 border-black p-3 rounded-none">
                  {writingStyles.map((style) => (
                    <label key={style} className="flex items-center space-x-2 cursor-pointer hover:bg-muted p-1 rounded">
                      <input
                        type="checkbox"
                        checked={brand.style.includes(style)}
                        onChange={(e) => {
                          const updatedStyles = e.target.checked
                            ? [...brand.style, style]
                            : brand.style.filter(s => s !== style);
                          setBrand(prev => ({ ...prev, style: updatedStyles }));
                        }}
                        className="w-4 h-4 border-2 border-black rounded-none"
                      />
                      <span className="text-xs font-medium">{style}</span>
                    </label>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground">Select the writing styles that best match your brand's preferences.</p>
              </div>
            </div>
          </div>



          <div className="brutalist-card">
            <div className="bg-muted border-b-2 border-black p-6">
              <h3 className="flex items-center gap-2 font-bold uppercase mb-2">
                <KeyIcon size={20} weight="bold" />
                AI Engine Credentials
              </h3>
              <p className="font-medium">Your API keys are stored securely on your account (server-side). Leave fields blank to keep existing keys.</p>
            </div>
            <div className="pt-6 space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PROVIDERS.map((p) => (
                  <div key={p.id} className="space-y-2">
                    <Label className="font-black uppercase text-xs">
                      {p.label}
                      {user?.providers?.includes(p.id) && (
                        <span className="ml-2 text-[11px] font-medium text-green-600">• Connected</span>
                      )}
                    </Label>
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
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="brutalist-card">
            <div className="bg-muted border-b-2 border-black p-6">
              <h3 className="flex items-center gap-2 font-bold uppercase mb-2">
                <GlobeIcon size={20} weight="bold" />
                Platform Connections
              </h3>
              <p className="font-medium">Connect your social media accounts for direct publishing.</p>
            </div>
            <div className="pt-6 space-y-4 p-6">
              <div className="flex items-center justify-between p-4 border-2 border-black bg-background">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-[#1DA1F2] border-2 border-black flex items-center justify-center text-white`}>
                    <PlatformIcon platform="twitter" size={20} />
                  </div>
                  <span className="font-black uppercase text-sm">Twitter / X</span>
                </div>
                <Button 
                  variant="outline" 
                  className={`brutalist-button text-xs h-8 ${twitterConnected ? 'bg-green-500 text-white hover:bg-green-600' : ''}`}
                  onClick={handleTwitterConnect}
                  disabled={twitterConnected}
                >
                  {twitterConnected ? 'Connected' : 'Connect'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
