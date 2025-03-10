import React from "react";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/context/AuthContext";

describe("AuthContext", () => {
  it("provides default authentication state", () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it("updates authentication state on login", async () => {
    
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.login("user", "password");
    });

    expect(result.current.isAuthenticated).toBe(true);
  });
});
