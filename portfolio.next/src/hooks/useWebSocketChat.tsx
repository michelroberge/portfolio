import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useChat } from "@/context/ChatContext";

export function useWebSocketChat(isOpen: boolean) {
  const { 
    getMessages,
    addUserMessage,
    startAIMessage,
    completeCurrentMessage,
    setCurrentMessageText,
    appendToCurrentMessage,
    currentMessageRef,
    isStreaming: chatIsStreaming,
    isStreamingRef,
    streamingBuffer,
    updateStreamingState
  } = useChat();
  
  const wsRef = useRef<WebSocket | null>(null);
  const hasConnectedSuccessfully = useRef(false);
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  // Track page visibility
  const [isPageVisible, setIsPageVisible] = useState(true);
  // Force re-renders when visibility changes
  const [forceUpdate, setForceUpdate] = useState(0);

  const[ connected, setConnected] = useState(false);

  const stepCompleted = useRef(false);

  const wsUrl = useMemo(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const baseWsUrl = apiUrl.replace(/^http/, "ws");
    if ( baseWsUrl.endsWith("/"))
    {
      return baseWsUrl;
    }
    else{
      return `${baseWsUrl}/`; 
    }
  }, []);

  // Listen for visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      const wasHidden = !isPageVisible;
      setIsPageVisible(!document.hidden);
      
      // If page becomes visible and there were pending updates
      if (wasHidden && !document.hidden) {
        // Force a refresh of messages to ensure UI is updated
        setForceUpdate(prev => prev + 1);
        const currentMessages = getMessages();
        console.log("Page visible again, checking messages:", currentMessages.length);
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPageVisible, getMessages]);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current) {
      console.log(`socket already opened`);
      return;
    }

    console.log(`Attempting to connect to WebSocket: ${wsUrl}`);
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log("✅ Connected to WebSocket successfully");
      hasConnectedSuccessfully.current = true;
      setConnected(true)
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
  
      // 🛑 Ensure there's ONLY ONE active AI message
      if (!currentMessageRef.current) {
          console.log("🆕 No active AI message, creating one.");
          startAIMessage();
          updateStreamingState(true);
      }
  
      if (data.newBubble) {
          console.log("🔵 Creating a new AI message bubble...");
          if (currentMessageRef.current) {
            completeCurrentMessage(); // ✅ Finish previous AI response
          }
          streamingBuffer.current = "";
  
          // ✅ Create new AI message ONLY ONCE
          startAIMessage();
          setCurrentMessageText(data.response);
          updateStreamingState(true);
      } 
      else if (data.step) {
          setCurrentMessageText(data.response);
      }
      else if (data.response) {
        if ( !stepCompleted.current){
          stepCompleted.current = true;
          completeCurrentMessage();
        }
        console.log("✍️ Appending streamed response:", data.response);
        appendToCurrentMessage(data.response); // 
      }
    if (data.done) {
        console.log("✅ Streaming complete, delaying 100ms to wrap up.");
        setTimeout(() => {
          setCurrentMessageText(data.response);
          completeCurrentMessage(); // ✅ Marks the AI message as done
          updateStreamingState(false);
          streamingBuffer.current = "";
          
          // Force update for when page isn't focused
          const messages = getMessages();
          console.log("🛠 Checking messages after completion:", messages.length);
          setForceUpdate(prev => prev + 1);
          stepCompleted.current = false;
        }, 100);
      }
    };

    websocket.onerror = (error) => {
      console.error("❌ WebSocket connection error:", error);
      if (currentMessageRef.current) {
        completeCurrentMessage();
      }
      updateStreamingState(false);
    };

    websocket.onclose = (event) => {
      console.log(`❌ WebSocket disconnected (code: ${event.code}, reason: ${event.reason})`);
      wsRef.current = null;
      if (currentMessageRef.current) {
        completeCurrentMessage();
      }
      updateStreamingState(false);
    };

    wsRef.current = websocket;
  }, [wsUrl, startAIMessage, completeCurrentMessage, updateStreamingState, appendToCurrentMessage, setCurrentMessageText, getMessages]);

  // Connect/disconnect based on isOpen prop
  useEffect(() => {
    if (typeof window === "undefined"){
      console.log(`not opening socket server side`);
      return;
    }

    if (!wsRef.current && isOpen) {
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
  }, [isOpen, connectWebSocket, connected]);

  // Keep WebSocket alive during page visibility changes
  useEffect(() => {
    const pingInterval = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        try {
          // Send a small ping to keep the connection alive
          wsRef.current.send(JSON.stringify({ type: "ping" }));
        } catch (e) {
          console.warn("Failed to send ping:", e);
        }
      }
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(pingInterval);
  }, []);

  // Function to send a user message through the WebSocket
  const sendMessage = useCallback((text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket not connected");
      return;
    }
  
    // Add the user message to chat context
    addUserMessage(text);
  
    // Retrieve chat history (excluding system messages)
    const chatHistory = getMessages()
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
  }, [addUserMessage, getMessages]);
  
  return { 
    sendMessage,
    wsRef, 
    isStreaming: isStreamingRef.current || chatIsStreaming,
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    forceUpdate // Add this to help with the re-rendering
  };
}