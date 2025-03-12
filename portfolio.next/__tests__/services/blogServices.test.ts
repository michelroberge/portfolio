import { getBlog, getBlogs, archiveBlog, updateBlog } from "@/services/blogService";
import { BlogEntry } from "@/models/BlogEntry";

// Ensure fetch is mocked
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe("Blog Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch a single blog entry successfully", async () => {
    const fakeBlog: BlogEntry = {
      _id: "1",
      title: "Test Blog",
      publishAt: "2025-03-10",
      body: "Test body content",
      excerpt: "Test excerpt",
      link: "test-blog",
      isDraft: false,
      tags: ["tech", "testing"],
    };

    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => fakeBlog,
    } as Response);

    const blog = await getBlog("1");
    expect(blog).toEqual(fakeBlog);
    expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/1`);
  });

  it("should return null if the blog does not exist", async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: false,
      statusText: "Not Found",
    } as Response);

    const blog = await getBlog("999");
    expect(blog).toBeNull();
  });

  it("should fetch all blogs successfully", async () => {
    const fakeBlogs: BlogEntry[] = [
      {
        _id: "1",
        title: "Blog 1",
        publishAt: "2025-03-10",
        body: "Content 1",
        excerpt: "Excerpt 1",
        link: "blog-1",
        isDraft: false,
        tags: ["tag1"],
      },
      {
        _id: "2",
        title: "Blog 2",
        publishAt: "2025-03-12",
        body: "Content 2",
        excerpt: "Excerpt 2",
        link: "blog-2",
        isDraft: true,
        tags: ["tag2"],
      },
    ];

    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => fakeBlogs,
    } as Response);

    const blogs = await getBlogs();
    expect(blogs).toEqual(fakeBlogs);
    expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`, {
      method: "GET",
      credentials: "include",
    });
  });

  it("should throw an error if fetching blogs fails", async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: false,
      statusText: "Server Error",
    } as Response);

    await expect(getBlogs()).rejects.toThrow("Error fetching blogs");
  });

  it("should successfully archive a blog", async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
    } as Response);

    await expect(archiveBlog("1")).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/1`, {
      method: "DELETE",
      credentials: "include",
    });
  });

  it("should throw an error if archiving a blog fails", async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: false,
      statusText: "Failed to archive",
    } as Response);

    await expect(archiveBlog("1")).rejects.toThrow("Error archiving blog");
  });

  it("should successfully update a blog", async () => {
    const updatedData: Partial<BlogEntry> = { title: "Updated Title" };

    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
    } as Response);

    await expect(updateBlog("1", updatedData)).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/1`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
  });

  it("should throw an error if updating a blog fails", async () => {
    const updatedData: Partial<BlogEntry> = { title: "Updated Title" };

    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: false,
      statusText: "Update failed",
    } as Response);

    await expect(updateBlog("1", updatedData)).rejects.toThrow("Error updating blog");
  });
});
