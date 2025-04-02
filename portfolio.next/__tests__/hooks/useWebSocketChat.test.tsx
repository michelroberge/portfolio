import { renderHook } from "@testing-library/react";
import { useWebSocketChat } from "@/hooks/useWebSocketChat";
import { ChatProvider } from "@/context/ChatContext"; // ✅ Wrap provider

describe("useWebSocketChat", () => {
  it("connects to WebSocket when open", () => {
    const { result } = renderHook(() => useWebSocketChat(true), { wrapper: ChatProvider });

    expect(result.current.wsRef.current).not.toBeNull();
  });
});
