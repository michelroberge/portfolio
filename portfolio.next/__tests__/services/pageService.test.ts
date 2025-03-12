import { fetchPages, fetchPage, createPage, updatePage, deletePage } from "@/services/pageService";

global.fetch = jest.fn();

describe("Page Service", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it("fetchPages should return a list of pages", async () => {
    const mockPages = [{ _id: "1", title: "Test Page", content: "Page content" }];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPages,
    });

    const pages = await fetchPages();
    expect(pages).toEqual(mockPages);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/api/pages"), expect.objectContaining({ credentials: "include" }));
  });

  it("fetchPage should return a specific page", async () => {
    const mockPage = { _id: "1", title: "Test Page", content: "Page content" };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPage,
    });

    const page = await fetchPage("test-slug");
    expect(page).toEqual(mockPage);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/api/pages/test-slug"));
  });

  it("fetchPage should throw an error if page not found", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    await expect(fetchPage("non-existent")).rejects.toThrow("Page not found");
  });

  it("createPage should successfully create a page", async () => {
    const newPage = { title: "New Page", content: "New content" };
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => ({ _id: "2", ...newPage }) });

    const createdPage = await createPage(newPage);
    expect(createdPage).toEqual({ _id: "2", ...newPage });
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/api/pages"), expect.objectContaining({ method: "POST" }));
  });

  it("updatePage should successfully update a page", async () => {
    const updatedPage = { title: "Updated Page", content: "Updated content" };
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => updatedPage });

    const result = await updatePage("1", updatedPage);
    expect(result).toEqual(updatedPage);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/api/pages/1"), expect.objectContaining({ method: "PUT" }));
  });

  it("deletePage should successfully delete a page", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    await expect(deletePage("1")).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/api/pages/1"), expect.objectContaining({ method: "DELETE" }));
  });

  it("deletePage should throw an error if deletion fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    await expect(deletePage("1")).rejects.toThrow("Failed to delete page");
  });
});
