import { 
  fetchCareerTimeline,
  fetchCareerEntry,
  saveCareerEntry,
  deleteCareerEntry,
  linkEntries,
  parseLinkedInHTMLBackend,
  saveParsedJobs,
  LinkedInParseResult
} from '@/services/careerService';
import { API_ENDPOINTS } from '@/lib/constants';
import { CareerEntry, CareerEntryCreate } from '@/models/CareerEntry';

// Mock the global fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock console.error to prevent logging during tests
console.error = jest.fn();

describe('Career Service', () => {
  const mockCareerEntry: CareerEntry = {
    _id: '123',
    title: 'Software Engineer',
    company: 'Tech Corp',
    location: 'Remote',
    description: 'Full-stack development',
    startDate: '2023-01-01',
    endDate: null,
    type: 'job',
    skills: ['TypeScript', 'React', 'Node.js'],
    highlights: ['Led team projects'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const mockCareerEntryCreate: CareerEntryCreate = {
    title: 'New Engineer',
    company: 'New Corp',
    location: 'Remote',
    description: 'Backend development',
    startDate: '2024-01-01',
    endDate: null,
    type: 'job',
    skills: ['Python', 'Django']
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchCareerTimeline', () => {
    it('should fetch career timeline successfully', async () => {
      const mockTimeline = [mockCareerEntry];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTimeline)
      });

      const result = await fetchCareerTimeline();

      expect(mockFetch).toHaveBeenCalledWith(`${API_ENDPOINTS.career}/timeline`, {
        credentials: 'include'
      });
      expect(result).toEqual(mockTimeline);
    });

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(fetchCareerTimeline()).rejects.toThrow('Failed to fetch timeline data');
    });
  });

  describe('fetchCareerEntry', () => {
    it('should fetch single career entry successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCareerEntry)
      });

      const result = await fetchCareerEntry('123');

      expect(mockFetch).toHaveBeenCalledWith(`${API_ENDPOINTS.career}/timeline/123`, {
        credentials: 'include'
      });
      expect(result).toEqual(mockCareerEntry);
    });

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(fetchCareerEntry('123')).rejects.toThrow('Failed to fetch entry');
    });
  });

  describe('saveCareerEntry', () => {
    it('should create new career entry successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCareerEntry)
      });

      const result = await saveCareerEntry(mockCareerEntryCreate);

      expect(mockFetch).toHaveBeenCalledWith(`${API_ENDPOINTS.career}/timeline`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockCareerEntryCreate)
      });
      expect(result).toEqual(mockCareerEntry);
    });

    it('should update existing career entry successfully', async () => {
      const updateData = { ...mockCareerEntry, title: 'Updated Title' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updateData)
      });

      const result = await saveCareerEntry(updateData);

      expect(mockFetch).toHaveBeenCalledWith(`${API_ENDPOINTS.career}/timeline/123`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      expect(result).toEqual(updateData);
    });

    it('should throw error when save fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(saveCareerEntry(mockCareerEntryCreate)).rejects.toThrow('Failed to save entry');
    });
  });

  describe('deleteCareerEntry', () => {
    it('should delete career entry successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true
      });

      await deleteCareerEntry('123');

      expect(mockFetch).toHaveBeenCalledWith(`${API_ENDPOINTS.career}/timeline/123`, {
        method: 'DELETE',
        credentials: 'include'
      });
    });

    it('should throw error when deletion fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(deleteCareerEntry('123')).rejects.toThrow('Failed to delete entry');
    });
  });

  describe('linkEntries', () => {
    const linkedIds = ['456', '789'];

    it('should link entries successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true
      });

      await linkEntries('123', linkedIds);

      expect(mockFetch).toHaveBeenCalledWith(`${API_ENDPOINTS.career}/timeline/123/link`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedEntries: linkedIds })
      });
    });

    it('should throw error when linking fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(linkEntries('123', linkedIds)).rejects.toThrow('Failed to link entries');
    });
  });

  describe('LinkedIn Integration', () => {
    const mockLinkedInData: LinkedInParseResult[] = [{
      title: 'Software Developer',
      company: 'LinkedIn Corp',
      location: 'Remote',
      startDate: '2024-01-01',
      endDate: null,
      description: 'Full-stack development',
      skills: ['JavaScript', 'React'],
      linkedInUrl: 'https://linkedin.com/job/123'
    }];

    describe('parseLinkedInHTMLBackend', () => {
      const mockHTML = '<div>Mock LinkedIn HTML</div>';

      it('should parse LinkedIn HTML successfully', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockLinkedInData)
        });

        const result = await parseLinkedInHTMLBackend(mockHTML);

        expect(mockFetch).toHaveBeenCalledWith(`${API_ENDPOINTS.career}/parse-linkedin`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rawHTML: mockHTML })
        });
        expect(result).toEqual(mockLinkedInData);
      });

      it('should throw error when parsing fails', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false
        });

        await expect(parseLinkedInHTMLBackend(mockHTML)).rejects.toThrow('Failed to parse LinkedIn data.');
      });
    });

    describe('saveParsedJobs', () => {
      it('should save parsed LinkedIn jobs successfully', async () => {
        const mockSavedEntries: CareerEntry[] = [{
          ...mockCareerEntry,
          importedFromLinkedIn: true
        }];

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSavedEntries)
        });

        const result = await saveParsedJobs(mockLinkedInData);

        expect(mockFetch).toHaveBeenCalledWith(`${API_ENDPOINTS.career}/timeline/bulk`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockLinkedInData.map(data => ({
            ...data,
            type: 'job',
            url: data.linkedInUrl,
            highlights: [],
            importedFromLinkedIn: true
          })))
        });
        expect(result).toEqual(mockSavedEntries);
      });

      it('should throw error when saving fails', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false
        });

        await expect(saveParsedJobs(mockLinkedInData)).rejects.toThrow('Failed to save parsed jobs.');
      });
    });
  });
});
