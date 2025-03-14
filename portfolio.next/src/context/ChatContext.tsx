"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AUTH_API } from "@/lib/constants";

type ChatMessage = {
  role: "user" | "ai";
  text: string;
};

type ChatContextType = {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  updateMessage: (index: number, newText: string) => void; // ✅ New function
  clearChat: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Fetch greeting and context when chat initializes
  useEffect(() => {
    async function fetchChatData() {
      try {
        const greeting = await loadContext();

        if (greeting) {
          setMessages([
            { role: "ai", text: greeting },
          ]);
        } else {
          setMessages([{ role: "ai", text: "Hello! Ask me anything about my projects or skills." }]);
        }
      } catch (error) {
        console.error("Failed to fetch chat initialization data:", error);
        setMessages([{ role: "ai", text: "Hello! Ask me anything about my projects or skills." }]);
      }
    }

    fetchChatData();
  }, []);

  const loadContext = async () => {
    try {
      const greetingRes = await fetch(AUTH_API.chat, {
        credentials: "include",
      });
      const greeting = await greetingRes.json();

      if (!greetingRes.ok) {
        const error = await greetingRes.json();
        throw new Error(error.message || "Failed to fetch chat greeting");
      }

      return greeting;
    } catch (error) {
      console.error("Failed to load chat context:", error);
      return null;
    }
  };

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  // ✅ New function to update an existing message
  const updateMessage = (index: number, newText: string) => {
    setMessages((prev) =>
      prev.map((msg, i) => (i === index ? { ...msg, text: newText } : msg))
    );
  };

  const clearChat = () => {
    setMessages([{ role: "ai", text: "Hello! Ask me anything about my projects or skills." }]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, updateMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
