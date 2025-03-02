'use client';
import { createContext, useContext, useState, ReactNode } from "react";

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
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: "ai",
    text: "Hello! Ask me anything about my projects or skills."
  }]);

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