import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useChat } from "@/context/ChatContext";

export function useWebSocketChat(isOpen: boolean) {
  const { addMessage } = useChat();
  const wsRef = useRef<WebSocket | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamingResponseRef = useRef("");
  const [streamingResponse, setStreamingResponse] = useState("");

  const wsUrl = useMemo(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return apiUrl.replace(/^http/, "ws");
  }, []);

  useEffect(() => {
    if (isOpen && !wsRef.current) {
      const websocket = new WebSocket(wsUrl);

      websocket.onopen = () => console.log("Connected to WebSocket");

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

      websocket.onclose = () => {
        console.log("WebSocket disconnected");
        wsRef.current = null;
      };

      wsRef.current = websocket;
    }

    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [isOpen, wsUrl]);

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
