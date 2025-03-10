import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ProjectPage from "@/app/projects/[id]/page";
import { getProject } from "@/services/projectService";

jest.mock("@/services/projectService", () => ({
  getProject: jest.fn(),
}));

describe("Project Page", () => {
  it("fetches and displays a project", async () => {
    (getProject as jest.Mock).mockResolvedValue({ title: "Project 1", description: "Project Description" });
    render(<ProjectPage params={{ id: "1" }} />);
    
    await waitFor(() => expect(screen.getByText("Project 1")).toBeInTheDocument());
  });
});
