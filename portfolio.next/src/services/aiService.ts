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
        console.error("Failed to fetch AI configuration");
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
      if (!res.ok) {
        console.error("Failed to update AI configuration");
        throw new Error("Failed to update AI configuration");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Error updating AI configuration");
    }
  }

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SearchResult {
  title: string;
  description: string;
  type: 'blog' | 'project';
  link: string;
  score: number;
}

export async function searchContent(query: string): Promise<SearchResult[]> {
  try {
    const res = await fetch(`${API_ENDPOINTS.search}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Search failed');
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function chatWithAI(messages: ChatMessage[]): Promise<ChatMessage> {
  try {
    const res = await fetch(`${API_ENDPOINTS.chat}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Chat request failed');
    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}