import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useChat } from "@/context/ChatContext";

export function useWebSocketChat(isOpen: boolean) {
  const { 
    messages,
    addUserMessage,
    startAIMessage,
    updateCurrentMessage,
    completeCurrentMessage,
    createNewAIMessageBubble,
    setCurrentMessageText,
    appendToCurrentMessage,
    currentMessageRef,
    isStreaming: chatIsStreaming
  } = useChat();
  
  const wsRef = useRef<WebSocket | null>(null);
  const [localStreamingState, setLocalStreamingState] = useState(false);
  const streamingBuffer = useRef("");
  const currentMessageId = useRef<string | null>(null);
  const hasConnectedSuccessfully = useRef(false);
  const sessionIdRef = useRef<string>(crypto.randomUUID());


  const wsUrl = useMemo(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const baseWsUrl = apiUrl.replace(/^http/, "ws");
    return baseWsUrl;
  }, []);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current) {
      console.log(`socket already opened`);
      return;
      // wsRef.current.close();
      // wsRef.current = null;
    }

    console.log(`Attempting to connect to WebSocket: ${wsUrl}`);
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log("✅ Connected to WebSocket successfully");
      hasConnectedSuccessfully.current = true;
    };

    websocket.onmessage = (event) => {
      console.log("📡 WebSocket Received:", event.data);
      const data = JSON.parse(event.data);
  
      // 🛑 Ensure there’s ONLY ONE active AI message
      if (!currentMessageRef.current) {
          console.log("🆕 No active AI message, creating one.");
          currentMessageId.current = startAIMessage();
      }
  
      if (data.newBubble) {
          console.log("🔵 Creating a new AI message bubble...");
          completeCurrentMessage(); // ✅ Finish previous AI response
          streamingBuffer.current = "";
  
          // ✅ Create new AI message ONLY ONCE
          currentMessageId.current = startAIMessage();
          setCurrentMessageText(data.response);
      } 
      else if (data.step) {
          console.log("🔄 Step update received, REPLACING text:", data.response);
          setCurrentMessageText(data.response); // ✅ REPLACES existing message text
      } 
      else if (data.response) {
          console.log("✍️ Appending streamed response:", data.response);
          appendToCurrentMessage(data.response); // ✅ APPENDS text to the same AI bubble
      }
  
      if (data.done) {
          console.log("✅ Streaming complete.");
          completeCurrentMessage(); // ✅ Marks the AI message as done
          setLocalStreamingState(false);
          streamingBuffer.current = "";
          currentMessageId.current = null; // ✅ Reset for next response
      }
  };
  
  
  
  
  
  

    websocket.onerror = (error) => {
      console.error("❌ WebSocket connection error:", error);
      if (currentMessageId.current) {
        completeCurrentMessage();
      }
    };

    websocket.onclose = (event) => {
      console.log(`❌ WebSocket disconnected (code: ${event.code}, reason: ${event.reason})`);
      wsRef.current = null;
      if (currentMessageId.current) {
        completeCurrentMessage();
      }
      setLocalStreamingState(false);
    };

    wsRef.current = websocket;
  }, [wsUrl, startAIMessage, updateCurrentMessage, completeCurrentMessage, createNewAIMessageBubble]);

  // Connect/disconnect based on isOpen prop
  useEffect(() => {
    if (typeof window === "undefined"){
      console.log(`not opening socker server side`);
      return;
    }

    if (!wsRef.current) {
      console.log(`opening socket`);
      connectWebSocket();
    }

    return () => {
      if (!isOpen && wsRef.current) {
        console.log(`closing socket`);
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isOpen]);

  // Function to send a user message through the WebSocket
  const sendMessage = useCallback((text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket not connected");
      return;
    }
  
    // Add the user message to chat context
    addUserMessage(text);
  
    // Retrieve chat history (excluding system messages)
    const chatHistory = messages
      .filter(msg => msg.role === "user" || msg.role === "ai")
      .map(msg => ({ role: msg.role, text: msg.text }));
  
    // Send message to WebSocket
    wsRef.current.send(
      JSON.stringify({
        sessionId: sessionIdRef.current, // Ensure a valid session ID
        query: text,
        history: chatHistory,
      })
    );
  }, [addUserMessage, messages]);
  
  

  return { 
    sendMessage,
    wsRef, 
    isStreaming: localStreamingState || chatIsStreaming,
    isConnected: wsRef.current?.readyState === WebSocket.OPEN
  };
}