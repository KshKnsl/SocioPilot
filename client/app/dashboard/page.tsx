"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generate, getResults } from "@/lib/api";
import { StudioHeader } from "@/components/studio/StudioHeader";
import { ConfigSidebar } from "@/components/studio/ConfigSidebar";
import { GenerationResults } from "@/components/studio/GenerationResults";
import { EmptyState } from "@/components/studio/EmptyState";
import { LoadingState } from "@/components/studio/LoadingState";

const MODELS = [
  { id: 'gpt-4o-mini', provider: 'openai' },
  { id: 'gpt-4', provider: 'openai' },
  { id: 'gpt-3.5-turbo', provider: 'openai' },
  { id: 'groq:meta-llama/llama-guard-4-12b', provider: 'groq' },
  { id: 'groq:openai/gpt-oss-120b', provider: 'groq' },
  { id: 'groq:openai/gpt-oss-20b', provider: 'groq' },
  { id: 'gemini-2.5-flash', provider: 'gemini' },
  { id: 'gemini-2.5-pro', provider: 'gemini' },
  { id: 'claude-3-5-sonnet-latest', provider: 'anthropic' },
  { id: 'grok:grok-4-latest', provider: 'openai' }, // Mapping Grok to OpenAI key for now
];

export default function DashboardPage() {
  const router = useRouter();
  const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const fetchHistory = async () => {
    try {
      const data = await getResults();
      setHistory(data);
    } catch (e) {
      console.error("Failed to fetch history", e);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("sp_token");
    if (!token) {
      router.push("/login");
      return;
    }
    const sync = () => {
      setSelectedBrandId(localStorage.getItem("sp_selected_brand") ?? undefined);
      const savedConfig = localStorage.getItem("sp_config");
      if (savedConfig) {
        try {
          setConfig(JSON.parse(savedConfig));
        } catch (e) {
          console.error("Failed to parse saved config", e);
        }
      }
      fetchHistory();
    };
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const [result, setResult] = useState<any | null>(null);
  const [config, setConfig] = useState<{
    topicCount: number;
    ideasPerTopic: number;
    language: string;
    platforms: Record<string, boolean>;
    generateImages: boolean;
    model: string;
    openaiKey: string;
    groqKey: string;
    geminiKey: string;
    anthropicKey: string;
    topicsPromptExpansion: string;
    postsPromptExpansion: string;
  }>({
    topicCount: 3,
    ideasPerTopic: 2,
    language: "English",
    platforms: { Twitter: true, Facebook: false, Instagram: false, LinkedIn: false },
    generateImages: false,
    model: 'gpt-4o-mini',
    openaiKey: '',
    groqKey: '',
    geminiKey: '',
    anthropicKey: '',
    topicsPromptExpansion: '',
    postsPromptExpansion: ''
  });

  useEffect(() => {
    const savedModel = localStorage.getItem("sp_model");
    const openaiKey = localStorage.getItem("sp_openai_key") || '';
    const groqKey = localStorage.getItem("sp_groq_key") || '';
    const geminiKey = localStorage.getItem("sp_gemini_key") || '';
    const anthropicKey = localStorage.getItem("sp_anthropic_key") || '';

    setConfig(prev => ({ 
      ...prev, 
      model: savedModel || 'gpt-4o-mini',
      openaiKey,
      groqKey,
      geminiKey,
      anthropicKey
    }));
  }, []);

  const updateConfig = (updates: Partial<typeof config>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      if (updates.model) {
        localStorage.setItem("sp_model", updates.model);
      }
      return newConfig;
    });
  };

  async function onGenerate() {
    setLoading(true);
    setResult(null);
    try {
      const platformsArr = Object.keys(config.platforms).filter((k) => config.platforms[k as keyof typeof config.platforms]);
      
      // Auto-map API key based on model prefix
      let providerApiKey = config.openaiKey;
      if (config.model.startsWith('groq:')) providerApiKey = config.groqKey;
      else if (config.model.startsWith('gemini:')) providerApiKey = config.geminiKey;
      else if (config.model.startsWith('grok:')) providerApiKey = config.openaiKey; // Assuming Grok uses OpenAI-like key or its own
      else if (config.model.startsWith('claude:')) providerApiKey = config.anthropicKey;

      const res = await generate({
        brandId: selectedBrandId,
        ...config,
        platforms: platformsArr,
        providerApiKey: providerApiKey || null
      });
      setResult(res);
      fetchHistory();
    } catch (e) {
      console.error(e);
      alert("Generation failed");
    } finally {
      setLoading(false);
    }
  }

  const copy = (text: string) => navigator.clipboard.writeText(text);

  const filteredHistory = selectedBrandId 
    ? history.filter(h => h.brand?._id === selectedBrandId)
    : history;

  const availableModels = MODELS.filter(m => {
    if (m.provider === 'openai') return !!config.openaiKey;
    if (m.provider === 'groq') return !!config.groqKey;
    if (m.provider === 'gemini') return !!config.geminiKey;
    if (m.provider === 'anthropic') return !!config.anthropicKey;
    return false;
  });

  const currentModel = config.model || (availableModels.length > 0 ? availableModels[0].id : 'gpt-4o-mini');

  const isGenerateDisabled = loading || !selectedBrandId || (!config.openaiKey && !config.groqKey && !config.geminiKey && !config.anthropicKey);

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <StudioHeader 
        loading={loading}
        onGenerate={onGenerate}
        onClear={() => setResult(null)}
        hasResult={!!result}
        isGenerateDisabled={isGenerateDisabled}
        history={filteredHistory}
        currentResultId={result?._id}
        onSelectHistoryItem={setResult}
        isHistoryOpen={isHistoryOpen}
        setIsHistoryOpen={setIsHistoryOpen}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <ConfigSidebar 
            config={config}
            updateConfig={updateConfig}
            availableModels={availableModels}
            currentModel={currentModel}
          />
        </div>

        <div className="lg:col-span-8">
          {!result && !loading && (
            <EmptyState onGenerate={onGenerate} disabled={isGenerateDisabled} />
          )}

          {loading && <LoadingState />}

          {result && (
            <GenerationResults result={result} onCopy={copy} />
          )}
        </div>
      </div>
    </div>
  );
}