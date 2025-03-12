import { getHomePageData } from "@/services/homePageService";
import { fetchBlogEntries, fetchProjects } from "@/services/apiService";

jest.mock("@/services/apiService", () => ({
  fetchBlogEntries: jest.fn(),
  fetchProjects: jest.fn(),
}));

describe("HomePage Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return blogs and projects successfully", async () => {
    const mockBlogs = [{ _id: "1", title: "Blog 1", date: "2025-01-01", excerpt: "Blog excerpt", link: "/blog/1" }];
    const mockProjects = [{ _id: "2", title: "Project 1", excerpt: "Project excerpt", image: "/image.png", link: "/project/1" }];

    (fetchBlogEntries as jest.Mock).mockResolvedValueOnce(mockBlogs);
    (fetchProjects as jest.Mock).mockResolvedValueOnce(mockProjects);

    const data = await getHomePageData();

    expect(data).toEqual({ blogs: mockBlogs, projects: mockProjects });
    expect(fetchBlogEntries).toHaveBeenCalledTimes(1);
    expect(fetchProjects).toHaveBeenCalledTimes(1);
  });

  it("should return empty arrays if API calls fail", async () => {
    (fetchBlogEntries as jest.Mock).mockRejectedValueOnce(new Error("API Error"));
    (fetchProjects as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    const data = await getHomePageData();

    expect(data).toEqual({ blogs: [], projects: [] });
    expect(fetchBlogEntries).toHaveBeenCalledTimes(1);
    expect(fetchProjects).toHaveBeenCalledTimes(1);
  });
});
