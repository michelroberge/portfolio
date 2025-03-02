"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useChat } from "@/context/ChatContext";

export default function Chat() {
  const { messages, addMessage } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // ✅ Expand/Minimize state
  const [input, setInput] = useState("");
  const wsRef = useRef<WebSocket | null>(null); // ✅ Use ref instead of state
  const [isStreaming, setIsStreaming] = useState(false);
  const streamingResponseRef = useRef(""); // Stores the AI's full response
  const [streamingResponse, setStreamingResponse] = useState(""); // Triggers UI updates

  useEffect(() => {
    if (isOpen && !wsRef.current) {
      const websocket = new WebSocket("ws://localhost:5000");

      websocket.onopen = () => console.log("Connected to WebSocket");

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.response) {
          setIsStreaming(true);
          streamingResponseRef.current += data.response; // ✅ Append to ref
          setStreamingResponse(streamingResponseRef.current); // ✅ Trigger UI update
        }

        if (data.done) {
          setIsStreaming(false);
        }
      };

      websocket.onclose = () => {
        console.log("WebSocket disconnected");
        wsRef.current = null; // ✅ Ensure it resets on close
      };

      wsRef.current = websocket;
    }

    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [isOpen]); // ✅ Removed ws from dependencies

  // ✅ Use useCallback to prevent unnecessary re-renders
  const safeAddMessage = useCallback(
    (message: { role: "user" | "ai"; text: string }) => {
      addMessage(message);
    },
    [addMessage]
  );

  // ✅ Ensure AI response is stored in chat history after streaming ends
  useEffect(() => {
    if (!isStreaming && streamingResponseRef.current) {
      safeAddMessage({ role: "ai", text: streamingResponseRef.current });
      streamingResponseRef.current = ""; // Reset buffer
      setStreamingResponse(""); // Clear state after saving
    }
  }, [isStreaming, safeAddMessage]);

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current) return;

    const userMessage = { role: "user", text: input } as const; // ✅ Fixed type assertion
    safeAddMessage(userMessage);
    wsRef.current.send(JSON.stringify({ sessionId: "123", query: input }));
    setInput("");

    // ✅ Reset streaming response before AI starts replying
    streamingResponseRef.current = "";
    setStreamingResponse("");
    setIsStreaming(true);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isOpen && (
        <div
          className={`shadow-lg border border-gray-300 bg-white rounded-lg overflow-hidden transition-all duration-300
            ${isExpanded ? "h-[90vh] w-[90vw] md:w-[50vw]" : "h-96 w-[50vw] md:w-80"}`}
        >
          {/* ✅ Chat Header with Expand/Minimize Buttons */}
          <div className="p-3 bg-gray-800 text-white flex justify-between items-center">
            <span>Chat</span>
            <div>
              <button
                className="text-lg mx-2"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Minimize" : "Maximize"}
              >
                {isExpanded ? "🗕" : "⛶"}
              </button>
              <button className="text-lg" onClick={() => setIsOpen(false)} title="Close">
                ✖
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="p-4 flex flex-col space-y-2 max-h-[80%] overflow-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg text-sm ${
                  msg.role === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {/* ✅ Show Streaming AI Response (Live Updating) */}
            {isStreaming && (
              <div className="p-2 rounded-lg text-sm bg-gray-200 text-black self-start">
                {streamingResponse}
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="flex items-center space-x-2 border-t pt-2 p-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded text-sm"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()} // ✅ Changed to onKeyDown
            />
            <button
              className="bg-gray-800 hover:bg-gray-600 transition text-white px-3 py-1 rounded text-sm"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
      
      {/* Floating Chat Button */}
      <button
        className="bg-gray-800 hover:bg-gray-600 transition text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✖" : "💬"}
      </button>
    </div>
  );
}
