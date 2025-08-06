// portfolio.next/src/services/chatbotHistoryService.ts

import { ADMIN_API } from "@/lib/constants";

export interface ChatbotRequestLog {
  _id: string;
  ip: string;
  country?: string;
  userAgent?: string;
  origin?: string;
  referer?: string;
  host?: string;
  requestPayload: any;
  responsePayload?: any;
  status: "success" | "error" | "blocked" | "other";
  error?: string;
  blacklisted: boolean;
  whitelisted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatbotHistoryResponse {
  logs: ChatbotRequestLog[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Fetches chatbot request history with pagination
 */
export async function fetchChatbotHistory(
  page: number = 1, 
  limit: number = 50, 
  cookieHeader: string | null = null
): Promise<ChatbotHistoryResponse> {
  try {
    const url = `${ADMIN_API.chatbotHistory.list}?page=${page}&limit=${limit}`;

    const headers: HeadersInit = cookieHeader
      ? { Cookie: cookieHeader } // Pass cookies for SSR requests
      : {};

    const response = await fetch(url, {
      credentials: "include",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch chatbot history");
    }
    return await response.json();
  } catch (err) {
    console.error("Failed to fetch chatbot history:", err);
    throw err;
  }
}

/**
 * Deletes a chatbot request log entry
 */
export async function deleteChatbotRequestLog(id: string): Promise<void> {
  try {
    const response = await fetch(ADMIN_API.chatbotHistory.delete(id), {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete chatbot request log");
    }
  } catch (err) {
    console.error("Failed to delete chatbot request log:", err);
    throw err;
  }
} 