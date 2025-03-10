import { getAuthUser } from "@/services/authService";

// Mock next/headers for cookies
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

import { cookies } from "next/headers";

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  });

  it("should return authenticated user on success", async () => {
    // Mock cookies to return a token
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: "mock-token" }),
    });

    // Mock fetch response
    const mockUser = { id: "123", isAdmin: true, authenticated: true, user: { id: "123", isAdmin: true } };
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    } as Response);

    const user = await getAuthUser();
    expect(user).toEqual({ id: "123", isAdmin: true, message: "should be good" });
    expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check`, {
      method: "GET",
      headers: { Authorization: "Bearer mock-token" },
      credentials: "include",
    });
  });

  it("should return default unauthenticated user if no token is found", async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });

    const user = await getAuthUser();
    expect(user).toEqual({ id: "0", isAdmin: false, message: "no cookie found" });
  });

  it("should return default unauthenticated user if authentication fails", async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: "mock-token" }),
    });

    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: false,
      statusText: "Unauthorized",
    } as Response);

    const user = await getAuthUser();
    expect(user).toEqual({ id: "0", isAdmin: false, message: process.env.NEXT_PUBLIC_API_URL });
  });

  it("should return null on fetch error", async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: "mock-token" }),
    });

    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(new Error("Network error"));

    const user = await getAuthUser();
    expect(user).toBeNull();
  });
});
