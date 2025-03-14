import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useChat } from "@/context/ChatContext";

export function useWebSocketChat(isOpen: boolean) {
  const { addMessage } = useChat();
  const wsRef = useRef<WebSocket | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamingResponseRef = useRef("");
  const [streamingResponse, setStreamingResponse] = useState("");
  const [useTrailingSlash, setUseTrailingSlash] = useState(false);

  const wsUrl = useMemo(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const baseWsUrl = apiUrl.replace(/^http/, "ws");
    // Add trailing slash only if needed (will be determined after connection attempt)
    return useTrailingSlash ? `${baseWsUrl}/` : baseWsUrl;
  }, [useTrailingSlash]);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    console.log(`Attempting to connect to WebSocket: ${wsUrl}`);
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log("Connected to WebSocket successfully");
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.response) {
        setIsStreaming(true);
        streamingResponseRef.current += data.response;
        setStreamingResponse(streamingResponseRef.current);
      }

      if (data.done) {
        setIsStreaming(false);
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket connection error:", error);
      if (!useTrailingSlash) {
        console.log("Retrying with trailing slash...");
        setUseTrailingSlash(true);
      }
    };

    websocket.onclose = (event) => {
      console.log(`WebSocket disconnected with code: ${event.code}, reason: ${event.reason}`);
      wsRef.current = null;
      
      // If this was a connection failure (not a normal close) and we haven't tried with trailing slash yet
      if (event.code !== 1000 && !useTrailingSlash) {
        console.log("Connection failed. Retrying with trailing slash...");
        setUseTrailingSlash(true);
      }
    };

    wsRef.current = websocket;
  }, [wsUrl, useTrailingSlash]);

  useEffect(() => {
    if (isOpen && !wsRef.current) {
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isOpen, connectWebSocket]);

  const safeAddMessage = useCallback(
    (message: { role: "user" | "ai"; text: string }) => {
      addMessage(message);
    },
    [addMessage]
  );

  useEffect(() => {
    if (!isStreaming && streamingResponseRef.current) {
      safeAddMessage({ role: "ai", text: streamingResponseRef.current });
      streamingResponseRef.current = "";
      setStreamingResponse("");
    }
  }, [isStreaming, safeAddMessage]);

  return { wsRef, isStreaming, streamingResponse, setStreamingResponse, setIsStreaming };
}
