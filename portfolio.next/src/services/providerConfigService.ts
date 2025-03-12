// portfolio.next/src/services/providerConfigService.ts

import { API_ENDPOINTS } from "@/lib/constants";
import { ProviderConfig } from "@/models/ProviderConfig";

/**
 * Fetches all provider configurations
 */
export async function getProviderConfigs(): Promise<ProviderConfig[]> {
  try {
    const response = await fetch(`${API_ENDPOINTS.admin}/provider-configs`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch provider configurations");
    }

    return await response.json();
  } catch (err) {
    console.error("Failed to fetch provider configs:", err);
    throw err;
  }
}

/**
 * Updates a provider configuration
 */
export async function updateProviderConfig(
  id: string,
  config: Partial<ProviderConfig>
): Promise<ProviderConfig> {
  try {
    const response = await fetch(`${API_ENDPOINTS.admin}/provider-configs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error("Failed to update provider configuration");
    }

    return await response.json();
  } catch (err) {
    console.error("Failed to update provider config:", err);
    throw err;
  }
}
