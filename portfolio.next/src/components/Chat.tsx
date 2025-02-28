import { useState } from "react";

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "system", text: "Hello! Ask me anything about my projects or skills." }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");
    
    // Mock API response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", text: "This is a mock response from AI." }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-80 shadow-lg border border-gray-300 bg-white rounded-lg overflow-hidden">
          <div className="p-4 flex flex-col space-y-2 max-h-80 overflow-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg text-sm ${msg.role === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"}`}
              >
                {msg.text}
              </div>
            ))}
            <div className="flex items-center space-x-2 border-t pt-2 p-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded text-sm"
                placeholder="Ask something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                className="bg-gray-800 hover:bg-gray-600 transition text-white px-3 py-1 rounded text-sm"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        className="bg-gray-800 hover:bg-gray-600 transition text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✖" : "💬"}
      </button>
    </div>
  );
}