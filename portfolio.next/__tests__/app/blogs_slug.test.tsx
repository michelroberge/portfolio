import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import BlogPage from "@/app/blogs/[slug]/page";
import { getBlog } from "@/services/blogService";

jest.mock("@/services/blogService", () => ({
  getBlog: jest.fn(),
}));

describe("Blog Page", () => {
  it("fetches and displays a blog post", async () => {
    (getBlog as jest.Mock).mockResolvedValue({ title: "Test Blog", body: "Blog Content" });
    render(<BlogPage params={Promise.resolve({ slug: "test-blog" })} />);
    
    await waitFor(() => expect(screen.getByText("Test Blog")).toBeInTheDocument());
  });
});
