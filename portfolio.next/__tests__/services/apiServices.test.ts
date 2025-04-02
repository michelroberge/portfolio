import { fetchBlogEntries, fetchProjects } from "@/services/apiService";

describe("API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return blog entries on success", async () => {
    const mockBlogs = [{ title: "Test Blog", excerpt: "Test excerpt" }];
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockBlogs,
    } as Response);

    const result = await fetchBlogEntries();
    expect(result).toEqual(mockBlogs);
    expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`);
  });

  it("should return projects on success", async () => {
    const mockProjects = [{ title: "Test Project", description: "Test description" }];
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockProjects,
    } as Response);

    const result = await fetchProjects();
    expect(result).toEqual(mockProjects);
    expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
  });

  it("should throw an error if blog fetch fails", async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: false,
      statusText: "Server Error",
    } as Response);

    await expect(fetchBlogEntries()).rejects.toThrow("Error fetching blog entries: Server Error");
  });

  it("should throw an error if project fetch fails", async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: false,
      statusText: "Server Error",
    } as Response);

    await expect(fetchProjects()).rejects.toThrow("Error fetching projects: Server Error");
  });
});
