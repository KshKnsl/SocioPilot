"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generate } from "@/lib/api";
import { StudioHeader } from "@/components/studio/StudioHeader";
import { ConfigSidebar } from "@/components/studio/ConfigSidebar";
import { GenerationResults } from "@/components/studio/GenerationResults";

import { useStudioConfig } from "@/lib/hooks/useStudioConfig";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { config, selectedBrandId, apiKey } = useStudioConfig();

  useEffect(() => {
    const token = localStorage.getItem("sp_token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const [result, setResult] = useState<any | null>(null);
  async function onGenerate() {
    setLoading(true);
    setResult(null);
    try {
      const platformsArr = Object.keys(config.platforms).filter((k) => config.platforms[k as keyof typeof config.platforms]);
      const providerApiKey = apiKey || null;
      const { openaiKey, groqKey, geminiKey, grokKey, ...payloadConfig } = config as any;
      const payload = {
        brandId: selectedBrandId,
        ...payloadConfig,
        platforms: platformsArr,
        providerApiKey
      };
      const res = await generate(payload);
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
    <div className="max-w-screen-2xl mx-auto p-8 space-y-8">
      <StudioHeader 
        loading={loading}
        onGenerate={onGenerate}
        onClear={() => setResult(null)}
        hasResult={!!result}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <ConfigSidebar 
          />
        </div>

        <div className="lg:col-span-8">
          <>
                {!result && !loading && null}

            {loading && null}

            {result && (
              <GenerationResults result={result} onCopy={copy} />
            )}
          </>
        </div>
      </div>
    </div>
  );
}