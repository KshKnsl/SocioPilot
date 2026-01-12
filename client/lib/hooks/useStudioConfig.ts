"use client";

import { useState, useEffect } from "react";

const providerFromModel = (m = "") => {
  if (m.startsWith("groq:")) return "groq";
  if (m.startsWith("gemini")) return "gemini";
  return "openai";
};

export function useStudioConfig() {
  const [config, setConfig] = useState({
    topicCount: 3,
    ideasPerTopic: 2,
    language: "English",
    platforms: { Twitter: true } as Record<string, boolean>,
    generateImages: false,
    model: "gpt-4o-mini",
    topicsPromptExpansion: "",
    postsPromptExpansion: "",
    tone: "professional",
    voice: "",
  });

  const [apiProvider, setApiProvider] = useState("openai");
  const [apiKey, setApiKey] = useState("");
  const [providerKeys, setProviderKeys] = useState<Record<string, boolean>>({ openai: true, groq: true, gemini: true });

  useEffect(() => {
    const sync = async () => {
      if (typeof window === 'undefined') return;

      const savedConfigStr = localStorage.getItem("sp_config");
      const savedConfig = savedConfigStr ? JSON.parse(savedConfigStr) : {};
      const savedModel = localStorage.getItem("sp_model") || (savedConfig as any).model || "gpt-4o-mini";

      setConfig((prev) => ({ ...prev, ...(savedConfig as any), model: savedModel }));

      const provider = providerFromModel(savedModel);
      setApiProvider(provider);

      const keyMap = { openai: true, groq: true, gemini: true };
      setProviderKeys(keyMap);
      setApiKey("");
    };

    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const provider = providerFromModel(config.model);
    setApiProvider(provider);

    setApiKey(providerKeys[provider] ? '********' : "");
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

  const hasKey = (provider: string) => {
    return !!providerKeys[provider];
  };

  return { config, updateConfig, apiKey, apiProvider, hasKey };
}
