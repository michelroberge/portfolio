import { fetchAnalytics, trackPageView, trackEvent } from '@/services/analyticsService';
import { ADMIN_API } from '@/lib/constants';
import { AnalyticsData } from '@/models/Analytics';

describe('Analytics Service', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('fetchAnalytics', () => {
    const mockAnalytics: AnalyticsData = {
      pageViews: 100,
      uniqueVisitors: 50,
      topPages: [
        { path: '/home', views: 30 },
        { path: '/about', views: 20 },
      ],
    };

    it('should fetch analytics data correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAnalytics),
      });

      const result = await fetchAnalytics();

      expect(mockFetch).toHaveBeenCalledWith(ADMIN_API.analytics.list, {
        credentials: 'include',
      });
      expect(result).toEqual(mockAnalytics);
    });

    it('should handle errors correctly', async () => {
      const errorMessage = 'Failed to fetch analytics';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: errorMessage }),
      });

      await expect(fetchAnalytics()).rejects.toThrow(errorMessage);
    });
  });

  describe('trackPageView', () => {
    const mockPath = '/home';

    it('should track page view correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await trackPageView(mockPath);

      expect(mockFetch).toHaveBeenCalledWith(ADMIN_API.analytics.trackPage, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ path: mockPath }),
      });
    });

    it('should handle errors correctly', async () => {
      const errorMessage = 'Failed to track page view';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: errorMessage }),
      });

      await expect(trackPageView(mockPath)).rejects.toThrow(errorMessage);
    });
  });

  describe('trackEvent', () => {
    const mockEvent = 'button_click';
    const mockData = { buttonId: 'signup' };

    it('should track event correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await trackEvent(mockEvent, mockData);

      expect(mockFetch).toHaveBeenCalledWith(ADMIN_API.analytics.trackEvent, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ event: mockEvent, data: mockData }),
      });
    });

    it('should track event without data correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await trackEvent(mockEvent);

      expect(mockFetch).toHaveBeenCalledWith(ADMIN_API.analytics.trackEvent, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ event: mockEvent }),
      });
    });

    it('should handle errors correctly', async () => {
      const errorMessage = 'Failed to track event';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: errorMessage }),
      });

      await expect(trackEvent(mockEvent)).rejects.toThrow(errorMessage);
    });
  });
});
