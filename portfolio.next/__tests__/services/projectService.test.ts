import { getProject } from "@/services/projectService";

global.fetch = jest.fn();

describe("Project Service", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it("should return a project if API call is successful", async () => {
    const mockProject = {
      _id: "1",
      title: "Test Project",
      description: "Test project description",
      link: "/projects/1",
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProject,
    });

    const project = await getProject("1");
    expect(project).toEqual(mockProject);
    expect(fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/projects/1`
    );
  });

  it("should return null if API response is not ok", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const project = await getProject("1");
    expect(project).toBeNull();
  });

  it("should return null if an error occurs during fetch", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    const project = await getProject("1");
    expect(project).toBeNull();
  });
});
