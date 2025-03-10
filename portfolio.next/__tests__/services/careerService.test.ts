import {
    fetchCareerTimeline,
    fetchCareerEntry,
    saveCareerEntry,
    deleteCareerEntry,
    linkEntries,
    parseLinkedInHTMLBackend,
    saveParsedJobs,
  } from "@/services/careerService";
  import { CareerEntry } from "@/services/careerService";
  import { ParsedJob } from "@/models/ParsedJob";
  
  // Ensure fetch is mocked globally
  global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  
  const mockParsedJobs: ParsedJob[] = [
    {
      title: "Software Engineer",
      company: "Tech Corp",
      startDate: "2023-01-01",
      endDate: "2024-01-01",
      description: "Worked on frontend development",
      location: "Remote",
    },
  ];

  
  describe("Career Service", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should fetch the career timeline successfully", async () => {
      const mockTimeline = [
        { _id: "1", title: "Developer", startDate: "2023-01-01", description: "Worked on frontend" },
      ];
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTimeline,
      } as Response);
  
      const timeline = await fetchCareerTimeline();
      expect(timeline).toEqual(mockTimeline);
      expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/career/timeline`, { credentials: "include" });
    });
  
    it("should fetch a career entry successfully", async () => {
      const mockEntry: CareerEntry = {
        _id: "1",
        title: "Developer",
        startDate: "2023-01-01",
        description: "Worked on frontend",
        skills: ["React"],
        linkedEntries: [],
        importedFromLinkedIn: false,
      };
  
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockEntry,
      } as Response);
  
      const entry = await fetchCareerEntry("1");
      expect(entry).toEqual(mockEntry);
      expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/career/timeline/1`, { credentials: "include" });
    });
  
    it("should save a new career entry successfully", async () => {
      const newEntry: CareerEntry = {
        title: "Senior Developer",
        startDate: "2024-01-01",
        description: "Leading frontend projects",
        skills: ["React", "TypeScript"],
        linkedEntries: [],
        importedFromLinkedIn: false,
      };
  
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => newEntry,
      } as Response);
  
      const savedEntry = await saveCareerEntry(newEntry);
      expect(savedEntry).toEqual(newEntry);
      expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/career/timeline`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });
    });
  
    it("should delete a career entry successfully", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({ ok: true } as Response);
  
      await expect(deleteCareerEntry("1")).resolves.toBeUndefined();
      expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/career/timeline/1`, {
        method: "DELETE",
        credentials: "include",
      });
    });
  
    it("should link career entries successfully", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({ ok: true } as Response);
  
      await expect(linkEntries("1", ["2", "3"])).resolves.toBeUndefined();
      expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/career/timeline/1/link`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedEntries: ["2", "3"] }),
      });
    });
  
    it("should parse LinkedIn HTML data", async () => {
      const mockParsedData = { jobs: [{ title: "Software Engineer" }] };
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockParsedData,
      } as Response);
  
      const parsedData = await parseLinkedInHTMLBackend("<html>LinkedIn Data</html>");
      expect(parsedData).toEqual(mockParsedData);
      expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/career/parse-linkedin`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawHTML: "<html>LinkedIn Data</html>" }),
      });
    });
  
    it("should save parsed jobs successfully", async () => {
        (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
          ok: true,
          json: async () => mockParsedJobs,
        } as Response);
      
        const result = await saveParsedJobs(mockParsedJobs);
        expect(result).toEqual(mockParsedJobs);
        expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/career/timeline/bulk`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mockParsedJobs),
        });
      });
      
  
    it("should throw an error if fetching career timeline fails", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        statusText: "Server Error",
      } as Response);
  
      await expect(fetchCareerTimeline()).rejects.toThrow("Failed to fetch timeline data");
    });
  
    it("should throw an error if saving career entry fails", async () => {
      const newEntry: CareerEntry = {
        title: "Senior Developer",
        startDate: "2024-01-01",
        description: "Leading frontend projects",
        skills: ["React", "TypeScript"],
        linkedEntries: [],
        importedFromLinkedIn: false,
      };
  
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        statusText: "Failed to save",
      } as Response);
  
      await expect(saveCareerEntry(newEntry)).rejects.toThrow("Failed to save entry");
    });
  });
  