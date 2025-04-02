import { FileInfo } from "@/models/FileInfo";

describe("FileInfo Model", () => {
  it("has correct structure", () => {
    const file: FileInfo = {
      _id: "1",
      filename: "file.txt",
      originalName: "original.txt",
      contentType: "text/plain",
      metadata: {
        entityId: "123",
        context: "project",
        uploadedBy: "user",
        isPublic: true,
        size: 1024,
      },
    };

    expect(file.filename).toBe("file.txt");
    expect(file.metadata.isPublic).toBe(true);
  });
});
