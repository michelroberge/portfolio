"use client";
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { AUTH_API } from "@/lib/constants";

type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
  status?: "complete" | "streaming";
};

type ChatContextType = {
  messages: ChatMessage[];
  currentMessage: ChatMessage | null;
  isStreaming: boolean;
  
  // Message management functions
  addUserMessage: (text: string) => string; // Returns message ID
  startAIMessage: () => string; // Returns message ID for the AI message
  updateCurrentMessage: (text: string) => void;
  completeCurrentMessage: () => void;
  setCurrentMessageText: (text:string) => void;
  appendToCurrentMessage: (text:string) => void;
  
  // Advanced functions
  createNewAIMessageBubble: () => string; // Creates a new bubble during streaming
  clearChat: () => void;
  currentMessageRef: React.RefObject<ChatMessage | null>;
};

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<ChatMessage | null>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const currentMessageRef = useRef<ChatMessage | null>(null);

  // Fetch greeting and context when chat initializes
  useEffect(() => {
    async function fetchChatData() {
      try {
        const greeting = await loadContext();
        
        if (greeting) {
          const initialMessage: ChatMessage = {
            id: generateId(),
            role: "ai",
            text: greeting,
            status: "complete"
          };
          
          setMessages([initialMessage]);
        } else {
          const defaultMessage: ChatMessage = {
            id: generateId(),
            role: "ai",
            text: "Hello! Ask me anything about my projects or skills.",
            status: "complete"
          };
          
          setMessages([defaultMessage]);
        }
      } catch (error) {
        console.error("Failed to fetch chat initialization data:", error);
        const fallbackMessage: ChatMessage = {
          id: generateId(),
          role: "ai",
          text: "Hello! Ask me anything about my projects or skills.",
          status: "complete"
        };
        setMessages([fallbackMessage]);
      }
    }
    
    fetchChatData();
  }, []);

  const loadContext = async () => {
    try {
      const greetingRes = await fetch(AUTH_API.chat, {
        credentials: "include",
      });
      
      if (!greetingRes.ok) {
        const error = await greetingRes.json();
        throw new Error(error.message || "Failed to fetch chat greeting");
      }
      
      const greeting = await greetingRes.json();
      return greeting;
    } catch (error) {
      console.error("Failed to load chat context:", error);
      return null;
    }
  };

  // Add a user message
  const addUserMessage = (text: string) => {
    const messageId = generateId();
    const newMessage: ChatMessage = {
      id: messageId,
      role: "user",
      text,
      status: "complete"
    };
    
    setMessages(prev => [...prev, newMessage]);
    return messageId;
  };

  // Start a new AI message (typically at the beginning of streaming)
  const startAIMessage = () => {
    if (currentMessageRef.current) {
        console.warn("⚠️ AI message already exists, using the current one.");
        return currentMessageRef.current.id;
    }

    console.log("🆕 Creating a new AI message...");
    const messageId = generateId();
    const newMessage: ChatMessage = {
        id: messageId,
        role: "ai",
        text: "⏳", // Shows loading indicator
        status: "streaming"
    };

    setMessages(prev => [...prev, newMessage]);
    currentMessageRef.current = newMessage; // ✅ Instantly updates the ref
    setIsStreaming(true);

    return messageId;
};





  // Update the current message during streaming
  const updateCurrentMessage = (text: string) => {
    if (!currentMessage) return;
    
    setCurrentMessage(prev => prev ? { ...prev, text } : null);
    
    setMessages(prev => 
      prev.map(msg => 
        msg.id === currentMessage.id 
          ? { ...msg, text } 
          : msg
      )
    );
  };

  const setCurrentMessageText = (text: string) => {
    if (!currentMessageRef.current) {
        console.warn("⚠️ No active AI message, creating one.");
        startAIMessage();
    }

    setMessages(prev =>
        prev.map(msg =>
            msg.id === currentMessageRef.current?.id ? { ...msg, text } : msg
        )
    );
};



const appendToCurrentMessage = (text: string) => {
  if (!currentMessageRef.current) {
      console.warn("⚠️ No active AI message, creating one.");
      startAIMessage();
  }

  setMessages(prev =>
      prev.map(msg =>
          msg.id === currentMessageRef.current?.id ? { ...msg, text: msg.text + text } : msg
      )
  );
};




  // Mark the current message as complete
  const completeCurrentMessage = () => {
    if (!currentMessageRef.current) return;

    setMessages(prev =>
        prev.map(msg =>
            msg.id === currentMessageRef.current?.id ? { ...msg, status: "complete" } : msg
        )
    );

    currentMessageRef.current = null; // ✅ Reset the reference
    setIsStreaming(false);
};


  // Create a new AI message bubble during an ongoing streaming session
const createNewAIMessageBubble = () => {
    if (currentMessage) {
        setMessages(prev =>
            prev.map(msg => 
                msg.id === currentMessage.id 
                    ? { ...msg, status: "complete" } 
                    : msg
            )
        );
    }

    // Create a new message
    const messageId = generateId();
    const newMessage: ChatMessage = {
        id: messageId,
        role: "ai",
        text: "",  // Ensure the new bubble starts empty
        status: "streaming",
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage(newMessage);
    setIsStreaming(true);

    return messageId;
};


  // Clear the chat history
  const clearChat = () => {
    const defaultMessage: ChatMessage = {
      id: generateId(),
      role: "ai",
      text: "Hello! Ask me anything about my projects or skills.",
      status: "complete"
    };
    
    setMessages([defaultMessage]);
    setCurrentMessage(null);
    setIsStreaming(false);
  };

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        currentMessage, 
        isStreaming,
        addUserMessage,
        startAIMessage,
        updateCurrentMessage,
        completeCurrentMessage,
        createNewAIMessageBubble,
        clearChat,
        setCurrentMessageText,
        appendToCurrentMessage,
        currentMessageRef
      }}
    >
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