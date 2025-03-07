"use client";

import { useState } from "react";
import { updateAIConfig } from "@/services/aiService";

interface AIConfig {
  provider: "ollama" | "openai";
  clientId?: string;
  clientSecret?: string;
}

export default function AIModelSettings({ initialConfig }: { initialConfig: AIConfig }) {
  const [aiConfig, setAIConfig] = useState<AIConfig>(initialConfig);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      await updateAIConfig(aiConfig);
      alert("AI Model Updated Successfully");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">AI Model Settings</h1>
      {error && <p className="text-red-500">{error}</p>}

      <label className="block mb-4">
        Select AI Provider:
        <select
          value={aiConfig.provider}
          onChange={(e) => setAIConfig({ ...aiConfig, provider: e.target.value as "ollama" | "openai" })}
          className="w-full p-2 border rounded mt-2"
        >
          <option value="ollama">Ollama</option>
          <option value="openai">OpenAI</option>
        </select>
      </label>

      {aiConfig.provider === "openai" && (
        <>
          <label className="block mb-4">
            OpenAI Client ID:
            <input
              type="text"
              value={aiConfig.clientId || ""}
              onChange={(e) => setAIConfig({ ...aiConfig, clientId: e.target.value })}
              className="w-full p-2 border rounded mt-2"
            />
          </label>
          <label className="block mb-4">
            OpenAI Client Secret:
            <input
              type="password"
              value={aiConfig.clientSecret || ""}
              onChange={(e) => setAIConfig({ ...aiConfig, clientSecret: e.target.value })}
              className="w-full p-2 border rounded mt-2"
            />
          </label>
        </>
      )}

      <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
        Save Settings
      </button>
    </div>
  );
}
