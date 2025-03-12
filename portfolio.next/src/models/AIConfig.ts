/**
 * Model representing AI configuration settings
 */
export interface AIConfig {
  provider: "ollama" | "openai";
  clientId?: string;
  clientSecret?: string;
}
