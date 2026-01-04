"use client";

import { useState, useEffect } from "react";
import { getProviderKeys } from "@/lib/api";


const providerFromModel = (m = "") => {
  if (m.startsWith("groq:")) return "groq";
  if (m.startsWith("grok:")) return "grok";
  if (m.startsWith("gemini")) return "gemini";
  if (m.startsWith("claude")) return "grok";
  return "openai";
};

export function useStudioConfig() {
  const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>(undefined);
  const [config, setConfig] = useState({
    topicCount: 3,
    ideasPerTopic: 2,
    language: "English",
    platforms: { Twitter: true, Facebook: false, Instagram: false, LinkedIn: false },
    generateImages: false,
    model: "gpt-4o-mini",
    topicsPromptExpansion: "",
    postsPromptExpansion: "",
  });

  const [apiProvider, setApiProvider] = useState("openai");
  const [apiKey, setApiKey] = useState("");
  const [hasAnyKeyState, setHasAnyKeyState] = useState(false);
  const [providerKeys, setProviderKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    const sync = async () => {
      if (typeof window === 'undefined') return;

      setSelectedBrandId(localStorage.getItem("sp_selected_brand") ?? undefined);

      const savedConfigStr = localStorage.getItem("sp_config");
      const savedConfig = savedConfigStr ? JSON.parse(savedConfigStr) : {};
      const savedModel = localStorage.getItem("sp_model") || (savedConfig as any).model || "gpt-4o-mini";

      setConfig((prev) => ({ ...prev, ...(savedConfig as any), model: savedModel }));

      const provider = providerFromModel(savedModel);
      setApiProvider(provider);

      try {
        const keys = await getProviderKeys();
        setProviderKeys(keys);
        setApiKey(keys[provider] || "");
        setHasAnyKeyState(!!Object.keys(keys).length);
      } catch (e) {
        console.warn('Failed to fetch provider keys', e);
        setProviderKeys({});
        setApiKey("");
        setHasAnyKeyState(false);
      }
    };

    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const provider = providerFromModel(config.model);
    setApiProvider(provider);

    setApiKey(providerKeys[provider] || "");

    const any = !!(
      providerKeys?.openai ||
      providerKeys?.groq ||
      providerKeys?.gemini ||
      providerKeys?.grok
    );
    setHasAnyKeyState(!!any);
  }, [config.model, providerKeys]);

  const updateConfig = (updates: any) => {
    setConfig((prev) => {
      const newConfig = { ...prev, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem("sp_config", JSON.stringify(newConfig));
        if (updates.model) localStorage.setItem("sp_model", updates.model);
        window.dispatchEvent(new Event("storage"));
      }
      return newConfig;
    });
  };

  const hasAnyKey = hasAnyKeyState;

  const hasKey = (provider: string) => {
    return !!providerKeys[provider];
  };

  return { config, selectedBrandId, updateConfig, hasAnyKey, apiKey, apiProvider, hasKey };
}
