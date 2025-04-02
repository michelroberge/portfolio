import { render, screen, fireEvent, waitFor  } from "@testing-library/react";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Mock Auth Context
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn().mockReturnValue("/"),
}));

describe("Header Component", () => {
  const mockRefreshAuth = jest.fn();
  const mockRouterRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ refresh: mockRouterRefresh });
  });

  it("renders the site title and navigation links", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isAdmin: false,
    });

    render(<Header />);

    expect(screen.getByText("Curious Coder: A Portfolio")).toBeInTheDocument();
    expect(screen.getByText("About me")).toBeInTheDocument();
    expect(screen.getByText("Experience")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("shows 'Admin Panel' when user is admin", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isAdmin: true,
    });

    render(<Header />);

    expect(screen.getByText("Admin Panel")).toBeInTheDocument();
  });

  it("shows 'Login' when user is not authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isAdmin: false,
    });

    render(<Header />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("shows 'Logout' when user is authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
      refreshAuth: mockRefreshAuth,
    });

    render(<Header />);
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("calls logout function when clicking 'Logout'", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true })
    ) as jest.Mock;

    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
      refreshAuth: mockRefreshAuth,
    });

    render(<Header />);
    fireEvent.click(screen.getByText("Logout"));

    // Ensure fetch() is called first
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        { credentials: "include" }
      ));
  
      // Wait for state updates before verifying function calls
      await waitFor(() => {
        expect(mockRefreshAuth).toHaveBeenCalled();
        expect(mockRouterRefresh).toHaveBeenCalled();
      });
  });
});
