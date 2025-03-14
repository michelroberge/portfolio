import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useChat } from "@/context/ChatContext";

export function useWebSocketChat(isOpen: boolean) {
  const { messages, addMessage, updateMessage } = useChat();
  const wsRef = useRef<WebSocket | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamingResponseBuffer = useRef(""); // ✅ Buffer for AI response
  const [streamingResponse, setStreamingResponse] = useState("");
  const currentMessageIndex = useRef<number | null>(null); // ✅ Track the latest AI message
  const hasConnectedSuccessfully = useRef(false);

  const wsUrl = useMemo(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const baseWsUrl = apiUrl.replace(/^http/, "ws");
    return baseWsUrl;
  }, []);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    console.log(`Attempting to connect to WebSocket: ${wsUrl}`);
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log("✅ Connected to WebSocket successfully");
      hasConnectedSuccessfully.current = true;
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // ✅ Handle pipeline step updates separately
      if (data.response && !data.done && data.step) {
        setIsStreaming(true);
        setStreamingResponse(data.response);

        if (currentMessageIndex.current === null) {
          // 🔹 Ensure pipeline messages do not overwrite user messages
          const index = messages.length;
          // addMessage({ role: "ai", text: data.response });
          currentMessageIndex.current = index;
        } else {
          updateMessage(currentMessageIndex.current, data.response);
        }
      }

      // ✅ Start AI response in a new message if needed
      if (data.response && !data.done && !data.step) {
        setIsStreaming(true);

        // 🔹 Ensure AI response starts in a NEW message, not overwriting the user message
        if (currentMessageIndex.current === null || messages[currentMessageIndex.current]?.role !== "ai") {
          addMessage({ role: "ai", text: "" });
          const index = messages.length;
          currentMessageIndex.current = index;
        }

        // 🔹 Append streamed words to AI message
        streamingResponseBuffer.current += ` ${data.response}`;
        setStreamingResponse(streamingResponseBuffer.current.trim());
        updateMessage(currentMessageIndex.current, streamingResponseBuffer.current.trim());
      }

      // ✅ When a paragraph is complete, finalize and start a new one
      if (data.response && data.response.includes("\n\n")) {
        setIsStreaming(false);
        streamingResponseBuffer.current = "";
        addMessage({ role: "ai", text: "" }); // Start new AI bubble
        currentMessageIndex.current = messages.length; // Prepare for next paragraph
      }

      // ✅ When streaming is fully complete
      if (data.done) {
        setIsStreaming(false);
        setStreamingResponse("");
        currentMessageIndex.current = null; // Reset for next message
      }
    };

    websocket.onerror = (error) => {
      console.error("❌ WebSocket connection error:", error);
    };

    websocket.onclose = (event) => {
      console.log(`❌ WebSocket disconnected (code: ${event.code}, reason: ${event.reason})`);
      wsRef.current = null;
    };

    wsRef.current = websocket;
  }, [wsUrl]);

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

  return { wsRef, isStreaming, streamingResponse, setStreamingResponse, setIsStreaming };
}
