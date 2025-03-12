import { fetchTelemetry, TelemetryData } from '@/services/analyticsService';
import { API_ENDPOINTS } from '@/lib/constants';

// Mock the global fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock console.error to prevent logging during tests
console.error = jest.fn();

describe('Analytics Service', () => {
  const mockTelemetryData: TelemetryData = {
    users: 100,
    blogPosts: 25,
    projects: 15,
    sessions: 1000,
    pageHits: 5000
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchTelemetry', () => {
    it('should fetch telemetry data successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTelemetryData)
      });

      const result = await fetchTelemetry();

      expect(mockFetch).toHaveBeenCalledWith(API_ENDPOINTS.analytics.telemetry, {
        credentials: 'include'
      });
      expect(result).toEqual(mockTelemetryData);
    });

    it('should return null when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      const result = await fetchTelemetry();

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle network errors and return null', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(networkError);

      const result = await fetchTelemetry();

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });
});
