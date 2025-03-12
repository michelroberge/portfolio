import { getAIConfig, updateAIConfig } from "@/services/aiService";

global.fetch = jest.fn();

describe("AI Service", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it("should fetch AI configuration successfully", async () => {
    const mockConfig = { provider: "ollama" };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockConfig,
    });

    const config = await getAIConfig();
    expect(config).toEqual(mockConfig);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/provider-configs/ai"),
      expect.objectContaining({ credentials: "include" })
    );
  });

  it("should return default config if API response is not OK", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const config = await getAIConfig();
    expect(config).toEqual({ provider: "ollama" }); // Default value
  });

  it("should throw an error if fetching AI config fails", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    await expect(getAIConfig()).rejects.toThrow("Error fetching AI configuration");
  });

  it("should update AI configuration successfully", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    await expect(updateAIConfig({ provider: "openai", clientId: "abc", clientSecret: "xyz" })).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/provider-configs/ai"),
      expect.objectContaining({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ provider: "openai", clientId: "abc", clientSecret: "xyz" }),
      })
    );
  });

  it("should throw an error if updating AI config fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    await expect(updateAIConfig({ provider: "openai" })).rejects.toThrow("Error updating AI configuration");
  });
});
