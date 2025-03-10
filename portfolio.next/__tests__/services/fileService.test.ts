import { fetchFiles, uploadFile, deleteFile } from "@/services/fileService";

// Ensure fetch is mocked globally
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe("File Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch files successfully", async () => {
    const mockFiles = [
      { _id: "1", filename: "test.pdf", contentType: "application/pdf", metadata: {} },
    ];

    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFiles,
    } as Response);

    const files = await fetchFiles("123", "resume");
    expect(files).toEqual(mockFiles);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/files"),
      expect.objectContaining({ credentials: "include" })
    );
  });

  it("should return an empty array if fetch fails", async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(new Error("Network Error"));

    const files = await fetchFiles("123", "resume");
    expect(files).toEqual([]);
  });

  it("should upload a file successfully", async () => {
    const mockFile = new File(["dummy content"], "resume.pdf", { type: "application/pdf" });

    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    const response = await uploadFile(mockFile, "123", "resume", true);
    expect(response).toEqual({ success: true });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/files/upload"),
      expect.objectContaining({ method: "POST", body: mockFile })
    );
  });

  it("should throw an error if file upload fails", async () => {
    const mockFile = new File(["dummy content"], "resume.pdf", { type: "application/pdf" });

    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: false,
      statusText: "Upload failed",
    } as Response);

    await expect(uploadFile(mockFile, "123", "resume", true)).rejects.toThrow("Upload failed");
  });

  it("should delete a file successfully", async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    await expect(deleteFile("1")).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/api/files/1"), {
      method: "DELETE",
      credentials: "include",
    });
  });

  it("should throw an error if file deletion fails", async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: false,
      statusText: "Failed to delete",
    } as Response);

    await expect(deleteFile("1")).rejects.toThrow("Failed to delete");
  });
});
