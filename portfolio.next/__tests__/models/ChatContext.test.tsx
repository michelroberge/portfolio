import React from "react";
import { renderHook, act } from "@testing-library/react";
import { ChatProvider, useChat } from "@/context/ChatContext";

describe("ChatContext", () => {
  it("provides default chat state", () => {
    const { result } = renderHook(() => useChat(), { wrapper: ChatProvider });

    expect(result.current.messages).toEqual([]);
  });

  it("adds a message to chat", () => {
    const { result } = renderHook(() => useChat(), { wrapper: ChatProvider });

    act(() => {
      result.current.addMessage({ role: "user", text: "Hello!" });
    });

    expect(result.current.messages.length).toBe(1);
  });
});
