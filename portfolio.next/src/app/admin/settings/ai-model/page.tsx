"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface AIConfig {
  provider: "ollama" | "openai";
  clientId?: string;
  clientSecret?: string;
}

export default function AIModelSettings() {
  const { isAuthenticated, user } = useAuth();
  const [aiConfig, setAIConfig] = useState<AIConfig>({ provider: "ollama" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch(`${apiUrl}/api/provider-configs/ai`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch AI configuration");
        const data = await res.json();
        setAIConfig(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    if (isAuthenticated) fetchConfig();
  }, [isAuthenticated]);

  const handleSave = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/provider-configs/ai`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(aiConfig),
      });
      if (!res.ok) throw new Error("Failed to update AI configuration");
      alert("AI Model Updated Successfully");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!isAuthenticated) return <p>You are not authenticated.</p>;
  if (!user?.isAdmin) return <p>Only admins can access this page.</p>;
  if (loading) return <p>Loading AI configuration...</p>;

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