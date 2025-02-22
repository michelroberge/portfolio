// portfolio.next/__tests__/apiService.test.ts
import { fetchBlogEntries, fetchProjects } from "@/services/apiService";
global.fetch = jest.fn();

describe("API Service", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it("fetchBlogEntries should return blog data", async () => {
    const fakeData = [{ title: "Test Blog", excerpt: "Test excerpt" }];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => fakeData,
    });

    const data = await fetchBlogEntries();
    expect(data).toEqual(fakeData);
    expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`);
  });

  it("fetchProjects should return project data", async () => {
    const fakeData = [{ title: "Test Project", description: "Test description" }];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => fakeData,
    });

    const data = await fetchProjects();
    expect(data).toEqual(fakeData);
    expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
  });

  it("should throw an error if fetchBlogEntries response is not ok", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: "Not Found",
    });

    await expect(fetchBlogEntries()).rejects.toThrow("Error fetching blog entries: Not Found");
  });
});
