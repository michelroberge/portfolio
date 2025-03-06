export interface AIConfig {
    provider: "ollama" | "openai";
    clientId?: string;
    clientSecret?: string;
  }
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  
  export async function getAIConfig(): Promise<AIConfig> {
    try {
      const res = await fetch(`${apiUrl}/api/provider-configs/ai`, { credentials: "include" });
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
      const res = await fetch(`${apiUrl}/api/provider-configs/ai`, {
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
  