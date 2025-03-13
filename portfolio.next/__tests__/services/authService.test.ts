import { checkAuthStatus } from '@/services/authService';
import { AUTH_API } from '@/lib/constants';
import { User } from '@/models/User';

describe('Auth Service', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('checkAuthStatus', () => {
    const mockUser: User = {
      _id: '123',
      username: 'testuser',
      isAdmin: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    it('should fetch auth status correctly when authenticated', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: mockUser, isAuthenticated: true }),
      });

      const result = await checkAuthStatus();

      expect(mockFetch).toHaveBeenCalledWith(AUTH_API.auth.status, {
        credentials: 'include',
      });
      expect(result).toEqual({ user: mockUser, isAuthenticated: true });
    });

    it('should return not authenticated when no user', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: null, isAuthenticated: false }),
      });

      const result = await checkAuthStatus();

      expect(mockFetch).toHaveBeenCalledWith(AUTH_API.auth.status, {
        credentials: 'include',
      });
      expect(result).toEqual({ user: null, isAuthenticated: false });
    });

    it('should handle errors correctly', async () => {
      const errorMessage = 'Failed to check auth status';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: errorMessage }),
      });

      await expect(checkAuthStatus()).rejects.toThrow(errorMessage);
    });

    it('should handle network errors correctly', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(checkAuthStatus()).rejects.toThrow('Network error');
    });
  });
});
