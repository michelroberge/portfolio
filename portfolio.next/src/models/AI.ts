/**
 * Represents an AI configuration
 */
export interface AIConfig {
    provider: "ollama" | "openai";
    clientId?: string;
    clientSecret?: string;
}

/**
 * Represents a chat message
 */
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

/**
 * Represents an AI response
 */
export interface AIResponse {
    text: string;
    tokens: number;
    model: string;
}

/**
 * Represents a search result
 */
export interface SearchResult {
    title: string;
    description: string;
    type: 'blog' | 'project';
    link: string;
    score: number;
}
