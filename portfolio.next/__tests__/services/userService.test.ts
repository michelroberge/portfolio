import { getUsers, updateUserAdmin } from '@/services/userService';
import { API_ENDPOINTS } from '@/lib/constants';
import { User } from '@/models/User';

// Mock the global fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock console.error to prevent logging during tests
console.error = jest.fn();

describe('userService', () => {
  const mockUser: User = {
    _id: '123',
    username: 'testuser',
    isAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should fetch all users successfully', async () => {
      const mockUsers = [mockUser];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUsers)
      });

      const result = await getUsers();

      expect(mockFetch).toHaveBeenCalledWith(API_ENDPOINTS.admin.users, {
        credentials: 'include'
      });
      expect(result).toEqual(mockUsers);
    });

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(getUsers()).rejects.toThrow('Failed to fetch users');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(getUsers()).rejects.toThrow(networkError);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('updateUserAdmin', () => {
    const userId = '123';
    const isAdmin = true;

    it('should update user admin status successfully', async () => {
      const updatedUser = { ...mockUser, isAdmin };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedUser)
      });

      const result = await updateUserAdmin(userId, isAdmin);

      expect(mockFetch).toHaveBeenCalledWith(`${API_ENDPOINTS.admin.users}/${userId}/admin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ isAdmin })
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw error when update fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(updateUserAdmin(userId, isAdmin)).rejects.toThrow('Failed to update user admin status');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(updateUserAdmin(userId, isAdmin)).rejects.toThrow(networkError);
      expect(console.error).toHaveBeenCalled();
    });
  });
});
