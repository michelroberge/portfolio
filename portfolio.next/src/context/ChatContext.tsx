"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ChatMessage = {
  role: "user" | "ai";
  text: string;
};

type ChatContextType = {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearChat: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Fetch greeting and context when chat initializes
  useEffect(() => {
    async function fetchChatData() {
      try {
        const greetingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/greeting`);
        const { greeting } = await greetingRes.json();

        const contextRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/context`);
        const { context } = await contextRes.json();

        setMessages([
          { role: "ai", text: greeting },
          { role: "ai", text: context }
        ]);
      } catch (error) {
        console.error("Failed to fetch chat initialization data:", error);
        setMessages([{ role: "ai", text: "Hello! Ask me anything about my projects or skills." }]);
      }
    }

    fetchChatData();
  }, []);

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const clearChat = () => {
    setMessages([{ role: "ai", text: "Hello! Ask me anything about my projects or skills." }]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, clearChat }}>
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
