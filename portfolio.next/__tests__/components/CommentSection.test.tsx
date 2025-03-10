import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CommentSection from "@/components/CommentSection";
import { useAuth } from "@/context/AuthContext";

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("CommentSection Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    });
  });

  it("renders comment section title", async () => {
    render(<CommentSection blogId="1" />);
    await waitFor(() => expect(screen.getByText("Comments")).toBeInTheDocument());
  });

  it("shows login message when unauthenticated", async () => {
    render(<CommentSection blogId="1" />);
    await waitFor(() => expect(screen.getByText("Login to comment")).toBeInTheDocument());
  });
});
