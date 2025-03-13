// portfolio.next/src/services/providerConfigService.ts

import { ADMIN_API } from '@/lib/constants';
import { ProviderConfig } from '@/models/ProviderConfig';

/**
 * Fetch provider configuration
 */
export async function fetchProviderConfig(provider: string): Promise<ProviderConfig> {
    try {
        const res = await fetch(ADMIN_API.providerConfig.get(provider), {
            credentials: "include",
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to fetch provider configuration");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to fetch provider configuration:", error);
        throw error;
    }
}

/**
 * Fetch provider configuration
 */
export async function fetchProviderConfigs(): Promise<ProviderConfig[]> {
    try {
        const res = await fetch(ADMIN_API.providerConfig.list, {
            credentials: "include",
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to fetch provider configuration");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to fetch provider configuration:", error);
        throw error;
    }
}

/**
 * Create a new provider configuration
 */
export async function createProviderConfig(config: Omit<ProviderConfig, '_id'>): Promise<ProviderConfig> {
    try {
        const res = await fetch(ADMIN_API.providerConfig.create, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(config),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to create provider configuration");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to create provider configuration:", error);
        throw error;
    }
}

/**
 * Update an existing provider configuration
 */
export async function updateProviderConfig(id: string, config: Partial<ProviderConfig>): Promise<ProviderConfig> {
    try {
        const res = await fetch(ADMIN_API.providerConfig.update(id), {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(config),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to update provider configuration");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to update provider configuration:", error);
        throw error;
    }
}

/**
 * Delete a provider configuration
 */
export async function deleteProviderConfig(id: string): Promise<void> {
    try {
        const res = await fetch(ADMIN_API.providerConfig.delete(id), {
            method: "DELETE",
            credentials: "include",
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to delete provider configuration");
        }
    } catch (error) {
        console.error("Failed to delete provider configuration:", error);
        throw error;
    }
}
