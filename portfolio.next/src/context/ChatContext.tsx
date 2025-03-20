"use client";
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { PUBLIC_API } from "@/lib/constants";
import { logger } from "@/utils/logger";
type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
  status?: "complete" | "streaming";
};

type ChatContextType = {
  messages: React.RefObject<ChatMessage[]>;
  isStreaming: boolean;
  isStreamingRef: React.RefObject<boolean>;
  getMessages : () => ChatMessage[];
  // Message management functions
  addUserMessage: (text: string) => string; // Returns message ID
  startAIMessage: () => string; // Returns message ID for the AI message
  completeCurrentMessage: () => void;
  setCurrentMessageText: (text:string) => void;
  appendToCurrentMessage: (text:string) => void;
  clearChat: () => void;
  currentMessageRef: React.RefObject<ChatMessage | null>;
  streamingBuffer: React.RefObject<string>;
  updateStreamingState: (newState: boolean) => void;
};

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {

  const messagesRef = useRef<ChatMessage[]>([]); // ✅ Immediate updates
  const forceRender = useState(0)[1]; // ✅ Forces re-renders

  const [currentMessage, setCurrentMessage] = useState<ChatMessage | null>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  
  // Track streaming state with both state and ref for UI updates and cross-component tracking
  const isStreamingRef = useRef<boolean>(false);
  const currentMessageRef = useRef<ChatMessage | null>(null);
  const streamingBuffer = useRef<string>("");

  // Make sure state and ref stay in sync
  useEffect(() => {
    isStreamingRef.current = isStreaming;
  }, [isStreaming]);
  
  // Function to update streaming state both in state and ref
  const updateStreamingState = (newState: boolean) => {
    isStreamingRef.current = newState;
    setIsStreaming(newState);
  };

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
          
          messagesRef.current = [initialMessage];
        } else {
          const defaultMessage: ChatMessage = {
            id: generateId(),
            role: "ai",
            text: "Hello! Ask me anything about my projects or skills.",
            status: "complete"
          };
          
          messagesRef.current = [defaultMessage];
        }
      } catch (error) {
        logger.error("Failed to fetch chat initialization data:", error);
        const fallbackMessage: ChatMessage = {
          id: generateId(),
          role: "ai",
          text: "Hello! Ask me anything about my projects or skills.",
          status: "complete"
        };
        messagesRef.current = [fallbackMessage];
      }
    }
    
    fetchChatData();
  }, []);

  useEffect(()=>{
    logger.log(`new theoretical message count`, messagesRef.current?.length);
  }, [ messagesRef.current ]);

  const getMessages = () => messagesRef.current || [];

  const loadContext = async () => {
    try {
      const greetingRes = await fetch(`${PUBLIC_API.chat}/greetings`, {
        credentials: "include",
      });
      
      if (!greetingRes.ok) {
        const error = await greetingRes.json();
        throw new Error(error.message || "Failed to fetch chat greeting");
      }
      
      const data = await greetingRes.json();
      return data.greeting;
    } catch (error) {
      logger.error("Failed to load chat context:", error);
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
    
    messagesRef.current = [...messagesRef.current, newMessage];
    forceRender((prev) => prev + 1); 

    return messageId;
  };

  // Start a new AI message (typically at the beginning of streaming)
  const startAIMessage = () => {
    if (currentMessageRef.current) {
        logger.warn("⚠️ AI message already exists, using the current one.");
        return currentMessageRef.current.id;
    }

    // logger.log("🆕 Creating a new AI message...");
    const messageId = generateId();
    const newMessage: ChatMessage = {
        id: messageId,
        role: "ai",
        text: " ",
        status: "streaming"
    };

    logger.log(`startAIMessage`);

    messagesRef.current = [...messagesRef.current, newMessage]; 
    currentMessageRef.current = newMessage; 
    forceRender((prev) => prev + 1);
    updateStreamingState(true);
    return messageId;
  };


  const setCurrentMessageText = (text: string) => {
    if (!currentMessageRef.current) {
        logger.warn("⚠️ No active AI message, creating one.");
        currentMessageRef.current = {
            id: startAIMessage(),
            role: "ai",
            text: "",
            status: "streaming"
        };
    }
    if ( text){
logger.log(`setCurrentMessageText: ${text}`);
      messagesRef.current = messagesRef.current.map(msg =>
          msg.id === currentMessageRef.current?.id ? { ...msg, text } : msg
      );

      forceRender(prev => prev + 1); // ✅ Ensure UI updates
  }
};

const appendToCurrentMessage = (text: string) => {
  if (!currentMessageRef.current) {
      logger.warn("⚠️ No active AI message, creating one.");
      currentMessageRef.current = {
          id: startAIMessage(),
          role: "ai",
          text: "",
          status: "streaming"
      };
  }

  messagesRef.current = messagesRef.current.map(msg =>
      msg.id === currentMessageRef.current?.id ? { ...msg, text: msg.text + text } : msg
  );

  forceRender(prev => prev + 1); // ✅ Ensure UI updates
};


  const completeCurrentMessage = () => {
    if (!currentMessageRef.current) {
      logger.warn("⚠️ Tried to complete a message, but none exists.");
      return;
    }
  
    messagesRef.current = messagesRef.current.map(msg =>
      msg.id === currentMessageRef.current?.id
        ? { ...msg, text: msg.text, status: "complete" }
        : msg
    );
  
    currentMessageRef.current = null;
    updateStreamingState(false);
    forceRender(prev => prev + 1); // ✅ Ensure re-render
  };
  

  // Clear the chat history
  const clearChat = () => {
    const defaultMessage: ChatMessage = {
      id: generateId(),
      role: "ai",
      text: "Hello! Ask me anything about my projects or skills.",
      status: "complete"
    };
    
    messagesRef.current = [defaultMessage];
    setCurrentMessage(null);
    currentMessageRef.current = null;
    updateStreamingState(false);
  };

  return (
    <ChatContext.Provider 
      value={{ 
        messages : messagesRef, 
        isStreaming,
        isStreamingRef,
        getMessages,
        addUserMessage,
        startAIMessage,
        completeCurrentMessage,
        clearChat,
        setCurrentMessageText,
        appendToCurrentMessage,
        currentMessageRef,
        streamingBuffer,
        updateStreamingState
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