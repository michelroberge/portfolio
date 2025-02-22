// portfolio.next/__tests__/blogService.test.ts
/// <reference types="jest" />
import { getBlog, BlogEntry } from "@/services/blogService";

global.fetch = jest.fn();

describe("Blog Service (Next.js)", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it("should fetch a blog entry successfully", async () => {
    const fakeBlog: BlogEntry = {
      id: 1,
      title: "Test Blog",
      date: "2025-02-22",
      body: "<p>Test body</p>",
      link: "test-blog-1",
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => fakeBlog,
    });

    const blog = await getBlog("1");
    expect(blog).toEqual(fakeBlog);
    expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/1`);
  });

  it("should return null if response is not ok", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: "Not Found",
    });

    const blog = await getBlog("1");
    expect(blog).toBeNull();
  });

  it("should return null if an error occurs", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));
    const blog = await getBlog("1");
    expect(blog).toBeNull();
  });
});
