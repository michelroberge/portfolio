import { getAuthUser, checkAuthStatus, AuthResponse } from '@/services/authService';
import { API_ENDPOINTS } from '@/lib/constants';
import { User } from '@/models/User';

// Mock the global fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock console.error and console.log to prevent logging during tests
console.error = jest.fn();
console.log = jest.fn();

describe('authService', () => {
  const mockUser: User = {
    _id: '123',
    username: 'testuser',
    isAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const mockAuthResponse: AuthResponse = {
    authenticated: true,
    user: mockUser,
    message: 'authenticated'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAuthUser', () => {
    it('should return authenticated user when auth check succeeds', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAuthResponse)
      });

      const result = await getAuthUser();

      expect(mockFetch).toHaveBeenCalledWith(`${API_ENDPOINTS.auth}/check`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store'
      });
      expect(result).toEqual(mockAuthResponse);
    });

    it('should return unauthenticated response when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      const result = await getAuthUser();

      expect(result).toEqual({
        authenticated: false,
        user: null,
        message: `${API_ENDPOINTS.auth}/admin/login`
      });
      expect(console.log).toHaveBeenCalledWith('Authentication failed');
    });

    it('should return unauthenticated response when user data is missing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ authenticated: false })
      });

      const result = await getAuthUser();

      expect(result).toEqual({
        authenticated: false,
        user: null,
        message: 'Authentication failed'
      });
    });

    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await getAuthUser();

      expect(result).toEqual({
        authenticated: false,
        user: null,
        message: 'Auth check failed'
      });
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('checkAuthStatus', () => {
    it('should return authenticated user when auth check succeeds', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAuthResponse)
      });

      const result = await checkAuthStatus();

      expect(mockFetch).toHaveBeenCalledWith(`${API_ENDPOINTS.auth}/check`, {
        method: 'GET',
        credentials: 'include'
      });
      expect(result).toEqual(mockAuthResponse);
    });

    it('should return unauthenticated response when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      const result = await checkAuthStatus();

      expect(result).toEqual({
        authenticated: false,
        user: null,
        message: 'Authentication failed'
      });
    });

    it('should return unauthenticated response when user data is missing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ authenticated: false })
      });

      const result = await checkAuthStatus();

      expect(result).toEqual({
        authenticated: false,
        user: null,
        message: 'Authentication failed'
      });
    });

    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await checkAuthStatus();

      expect(result).toEqual({
        authenticated: false,
        user: null,
        message: 'Auth check failed'
      });
      expect(console.error).toHaveBeenCalled();
    });
  });
});
