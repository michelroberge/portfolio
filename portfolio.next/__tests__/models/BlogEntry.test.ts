import { BlogEntry } from "@/models/BlogEntry";

describe("BlogEntry Model", () => {
  it("has required properties", () => {
    const blog: BlogEntry = {
      _id: "1",
      title: "Test Blog",
      body: "Content",
      link: "/blog/test",
      isDraft: false,
      tags: ["tech"],
    };

    expect(blog.title).toBe("Test Blog");
  });
});
