import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Page from "@/app/page";
import { getHomePageData } from "@/services/homePageService";

jest.mock("@/services/homePageService", () => ({
  getHomePageData: jest.fn(),
}));

describe("Home Page", () => {
  it("fetches and displays blogs and projects", async () => {
    (getHomePageData as jest.Mock).mockResolvedValue({
      blogs: [{ title: "Blog Post" }],
      projects: [{ title: "Project 1" }],
    });

    render(<Page />);

    await waitFor(() => expect(screen.getByText("Blog Post")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("Project 1")).toBeInTheDocument());
  });
});
