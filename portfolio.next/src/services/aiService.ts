import { ADMIN_API } from '@/lib/constants';
import { AIConfig, AIResponse, SearchResult } from '@/models/AI';

/**
 * Get AI completion
 */
export async function getCompletion(prompt: string): Promise<AIResponse> {
    try {
        const res = await fetch(ADMIN_API.ai.complete, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to get AI completion");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to get AI completion:", error);
        throw error;
    }
}

/**
 * Get embeddings for text
 */
export async function getEmbeddings(text: string): Promise<number[]> {
    try {
        const res = await fetch(ADMIN_API.ai.embeddings, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to get embeddings");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to get embeddings:", error);
        throw error;
    }
}

/**
 * Search for similar content
 */
export async function searchSimilar(query: string): Promise<SearchResult[]> {
    try {
        const res = await fetch(ADMIN_API.ai.similaritySearch, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to search similar content");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to search similar content:", error);
        throw error;
    }
}

/**
 * Get AI configuration
 */
export async function getAIConfig(): Promise<AIConfig> {
    try {
        const res = await fetch(ADMIN_API.ai.config, {
            credentials: "include",
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to get AI configuration");
        }

        return res.json();
    } catch (error) {
        console.error("Failed to get AI configuration:", error);
        throw error;
    }
}

/**
 * Update AI configuration
 */
export async function updateAIConfig(config: AIConfig): Promise<void> {
    try {
        const res = await fetch(ADMIN_API.ai.config, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(config),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Failed to update AI configuration");
        }
    } catch (error) {
        console.error("Failed to update AI configuration:", error);
        throw error;
    }
}