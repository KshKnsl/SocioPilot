"use client";

import { useState, useEffect } from "react";

const providerFromModel = (m = "") => {
  if (m.startsWith("groq:")) return "groq";
  if (m.startsWith("gemini")) return "gemini";
  return "openai";
};

export function useStudioConfig() {
  const [config, setConfig] = useState({
    topic: "",
    tone: "professional",
    platforms: "all",
    numPosts: 3,
    numIdeas: 5,
    additionalInstructions: "",
    topicCount: 3,
    language: "English",
    generateImages: false,
    model: "gpt-4o-mini",
    topicsPromptExpansion: "",
    postsPromptExpansion: "",
    voice: "",
  });
    
  const [apiProvider, setApiProvider] = useState("openai");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const sync = async () => {
      const savedConfigStr = localStorage.getItem("sp_config");
      const savedConfig = savedConfigStr ? JSON.parse(savedConfigStr) : {};
      const savedModel = localStorage.getItem("sp_model") || (savedConfig as any).model || "gpt-4o-mini";

      setConfig((prev) => ({ ...prev, ...(savedConfig as any), model: savedModel }));

      const provider = providerFromModel(savedModel);
      setApiProvider(provider);

      setApiKey("");
    };

    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const updateConfig = (updates: any) => {
    setConfig((prev) => {
      const newConfig = { ...prev, ...updates };
      localStorage.setItem("sp_config", JSON.stringify(newConfig));
      if (updates.model) localStorage.setItem("sp_model", updates.model);
      window.dispatchEvent(new Event("storage"));
      return newConfig;
    });
  };

  return { config, updateConfig, apiKey, apiProvider };
}
