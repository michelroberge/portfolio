import { API_ENDPOINTS } from "@/lib/constants";

export interface AIConfig {
    provider: "ollama" | "openai";
    clientId?: string;
    clientSecret?: string;
  }
    
  export async function getAIConfig(): Promise<AIConfig> {
    try {
      const res = await fetch(`${API_ENDPOINTS.providerConfig}/ai`, { credentials: "include" });
      if (!res.ok) {
        // throw new Error("Failed to fetch AI configuration");
        return { provider: "ollama" };
      }
      return await res.json();
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching AI configuration");
    }
  }
  
  export async function updateAIConfig(config: AIConfig) {
    try {
      const res = await fetch(`${API_ENDPOINTS.providerConfig}/ai`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Failed to update AI configuration");
    } catch (error) {
      console.error(error);
      throw new Error("Error updating AI configuration");
    }
  }
  