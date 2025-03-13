"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ProviderConfig } from "@/models/ProviderConfig";
import { fetchProviderConfigs, updateProviderConfig } from "@/services/providerConfigService";

export default function ProviderConfigPage() {
  const router = useRouter();
  const [configs, setConfigs] = useState<ProviderConfig[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    async function loadConfigs() {
      try {
        const data = await fetchProviderConfigs();
        setConfigs(data);
      } catch (err) {
        console.error('Failed to fetch provider configs:', err);
        setError('Failed to load provider configurations');
      }
    }

    if (isAuthenticated) {
      loadConfigs();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated || !(user?.isAdmin)) {
    router.push('/auth/login');
    return null;
  }

  const handleUpdate = async (id: string, config: Partial<ProviderConfig>) => {
    try {
      await updateProviderConfig(id, config);
      const updatedConfigs = await fetchProviderConfigs();
      setConfigs(updatedConfigs);
    } catch (err) {
      console.error('Failed to update provider config:', err);
      setError('Failed to update configuration');
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Provider Configuration</h1>
      <div className="space-y-6">
        {configs.map((config) => (
          <div key={config._id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">{config.name}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">API Key</label>
                <input
                  type="password"
                  value={config.apiKey || ''}
                  onChange={(e) => handleUpdate(config._id, { apiKey: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Base URL</label>
                <input
                  type="text"
                  value={config.baseUrl || ''}
                  onChange={(e) => handleUpdate(config._id, { baseUrl: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={config.status}
                  onChange={(e) => handleUpdate(config._id, { status: e.target.value as 'active' | 'inactive' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
