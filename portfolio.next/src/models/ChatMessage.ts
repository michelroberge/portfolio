/**
 * Model representing a message in a chat conversation with AI
 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
