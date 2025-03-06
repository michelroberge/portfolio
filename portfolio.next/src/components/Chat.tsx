"use client";

import { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { useWebSocketChat } from "@/hooks/useWebSocketChat";

export default function Chat() {
  const { messages, addMessage } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");

  const { wsRef, isStreaming, streamingResponse, setStreamingResponse, setIsStreaming } = useWebSocketChat(isOpen);

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current) return;

    addMessage({ role: "user", text: input });
    wsRef.current.send(JSON.stringify({ sessionId: "123", query: input }));
    setInput("");

    setStreamingResponse("");
    setIsStreaming(true);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isOpen && (
        <div className={`shadow-lg border border-gray-300 bg-white rounded-lg overflow-hidden transition-all duration-300
          ${isExpanded ? "h-[90vh] w-[90vw] md:w-[50vw]" : "h-96 w-[50vw] md:w-80"}`}
        >
          <div className="p-3 bg-gray-800 text-white flex justify-between items-center">
            <span>Chat</span>
            <div>
              <button className="text-lg mx-2" onClick={() => setIsExpanded(!isExpanded)} title={isExpanded ? "Minimize" : "Maximize"}>
                {isExpanded ? "🗕" : "⛶"}
              </button>
              <button className="text-lg" onClick={() => setIsOpen(false)} title="Close">✖</button>
            </div>
          </div>

          <div className="p-4 flex flex-col space-y-2 max-h-[80%] overflow-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`p-2 rounded-lg text-sm ${msg.role === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"}`}>
                {msg.text}
              </div>
            ))}

            {isStreaming && (
              <div className="p-2 rounded-lg text-sm bg-gray-200 text-black self-start">{streamingResponse}</div>
            )}
          </div>

          <div className="flex items-center space-x-2 border-t pt-2 p-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded text-sm"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="bg-gray-800 hover:bg-gray-600 transition text-white px-3 py-1 rounded text-sm" onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}

      <button className="bg-gray-800 hover:bg-gray-600 transition text-white p-3 rounded-full shadow-lg" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "✖" : "💬"}
      </button>
    </div>
  );
}
