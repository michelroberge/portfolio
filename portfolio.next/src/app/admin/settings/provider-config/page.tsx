"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface ProviderConfig {
  _id?: string;
  provider: string;
  clientId: string;
  clientSecret: string;
  callbackURL: string;
}

export default function ProviderConfigPage() {
  const { isAuthenticated, user } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [configs, setConfigs] = useState<ProviderConfig[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingConfigs, setEditingConfigs] = useState<Record<string, ProviderConfig>>({});
  // const [newConfig, setNewConfig] = useState<ProviderConfig>({
  //   provider: "",
  //   clientId: "",
  //   clientSecret: "",
  //   callbackURL: "",
  // });

  useEffect(() => {
    async function fetchConfigs() {
      try {
        const res = await fetch(`${apiUrl}/api/provider-configs`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch provider configurations");
        const data = await res.json();
        setConfigs(data);
        const initialEditing: Record<string, ProviderConfig> = {};
        data.forEach((config: ProviderConfig) => {
          initialEditing[config.provider] = config;
        });
        setEditingConfigs(initialEditing);
        setLoading(false);
      } catch (err: unknown) { // ✅ Use unknown instead of any
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred while fetching provider configurations.");
        }
        setLoading(false);
      }
    }

    if (isAuthenticated) fetchConfigs();
  }, [apiUrl, isAuthenticated]);

  const handleChange = (provider: string, field: keyof ProviderConfig, value: string) => {
    setEditingConfigs((prev) => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: value,
      },
    }));
  };

  const handleSave = async (provider: string) => {
    try {
      const configToSave = editingConfigs[provider];
      const res = await fetch(`${apiUrl}/api/provider-configs/${provider}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(configToSave),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update configuration");
      }
      const updatedConfig = await res.json();
      setConfigs((prev) => prev.map((c) => (c.provider === provider ? updatedConfig : c)));
      alert(`Configuration for ${provider} updated. A restart may be required to apply changes.`);
    } catch (err: unknown) { // ✅ Use unknown instead of any
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while saving the configuration.");
      }
    }
  };
/*
  const handleNewChange = (field: keyof ProviderConfig, value: string) => {
    setNewConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleNewSave = async () => {
    if (!newConfig.provider) {
      setError("Provider field is required for new configuration.");
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/api/provider-configs/${newConfig.provider}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newConfig),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create new configuration");
      }
      const createdConfig = await res.json();
      setConfigs((prev) => [...prev, createdConfig]);
      setEditingConfigs((prev) => ({ ...prev, [createdConfig.provider]: createdConfig }));
      setNewConfig({ provider: "", clientId: "", clientSecret: "", callbackURL: "" });
    } catch (err: unknown) { // ✅ Use unknown instead of any
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while creating a new configuration.");
      }
    }
  };*/

  if (loading) return <p>Loading provider configurations...</p>;
  if (!isAuthenticated) return <p>You are not authenticated.</p>;
  if (!user?.isAdmin) return <p>Only admins can access this page.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">OAuth2/OIDC Provider Configuration</h1>
      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Provider</th>
            <th className="border p-2 text-left">Client ID</th>
            <th className="border p-2 text-left">Client Secret</th>
            <th className="border p-2 text-left">Callback URL</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {configs.map((config) => (
            <tr key={config.provider}>
              <td className="border p-2">{config.provider}</td>
              <td className="border p-2">
                <input
                  type="text"
                  value={editingConfigs[config.provider]?.clientId || ""}
                  onChange={(e) => handleChange(config.provider, "clientId", e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="password"
                  value={editingConfigs[config.provider]?.clientSecret || ""}
                  onChange={(e) => handleChange(config.provider, "clientSecret", e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={editingConfigs[config.provider]?.callbackURL || ""}
                  onChange={(e) => handleChange(config.provider, "callbackURL", e.target.value)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleSave(config.provider)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link href="/admin" className="text-blue-500 underline">
        Back to Dashboard
      </Link>
    </div>
  );
}
