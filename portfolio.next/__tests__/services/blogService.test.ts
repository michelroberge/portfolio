import { fetchBlogEntries, fetchBlogEntry, createBlogEntry, updateBlogEntry, deleteBlogEntry } from '@/services/blogService';
import { API_ENDPOINTS } from '@/lib/constants';
import { BlogEntry } from '@/models/BlogEntry';

// Mock the global fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock console.error to prevent logging during tests
console.error = jest.fn();

describe('blogService', () => {
  const mockBlogEntry: BlogEntry = {
    _id: '123',
    title: 'Test Blog',
    body: 'Test Content',
    excerpt: 'Test Description',
    tags: ['test'],
    isDraft: false,
    link: 'test-link',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('fetchBlogEntries', () => {
    it('should fetch all blog entries successfully', async () => {
      const mockResponse = [mockBlogEntry];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await fetchBlogEntries();

      expect(mockFetch).toHaveBeenCalledWith(API_ENDPOINTS.admin.blogs, {
        credentials: 'include'
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(fetchBlogEntries()).rejects.toThrow('Failed to fetch blog entries');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchBlogEntries()).rejects.toThrow('Network error');
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('fetchBlogEntry', () => {
    it('should fetch a single blog entry successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBlogEntry)
      });

      const result = await fetchBlogEntry('123');

      expect(mockFetch).toHaveBeenCalledWith(`${API_ENDPOINTS.blog}/123`, {
        credentials: 'include'
      });
      expect(result).toEqual(mockBlogEntry);
    });

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(fetchBlogEntry('123')).rejects.toThrow('Failed to fetch blog entry');
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('createBlogEntry', () => {
    const newBlogEntry = {
      _id :'',
      title: 'New Blog',
      body: 'New Content',
      excerpt: 'New Description',
      slug: 'new-blog',
      tags: ['new'],
      isDraft: true,
      publishAt: new Date().toISOString(),
      link: 'new-blog',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    it('should create a blog entry successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBlogEntry)
      });

      const result = await createBlogEntry(newBlogEntry);

      expect(mockFetch).toHaveBeenCalledWith(API_ENDPOINTS.admin.blogs, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newBlogEntry)
      });
      expect(result).toEqual(mockBlogEntry);
    });

    it('should throw error when creation fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(createBlogEntry(newBlogEntry)).rejects.toThrow('Failed to create blog entry');
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('updateBlogEntry', () => {
    const updateData = {
      title: 'Updated Blog',
      content: 'Updated Content'
    };

    it('should update a blog entry successfully', async () => {
      const updatedBlog = { ...mockBlogEntry, ...updateData };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedBlog)
      });

      const result = await updateBlogEntry('123', updateData);

      expect(mockFetch).toHaveBeenCalledWith(`${API_ENDPOINTS.admin.blogs}/123`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(updateData)
      });
      expect(result).toEqual(updatedBlog);
    });

    it('should throw error when update fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(updateBlogEntry('123', updateData)).rejects.toThrow('Failed to update blog entry');
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('deleteBlogEntry', () => {
    it('should delete a blog entry successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true
      });

      await deleteBlogEntry('123');

      expect(mockFetch).toHaveBeenCalledWith(`${API_ENDPOINTS.admin.blogs}/123`, {
        method: 'DELETE',
        credentials: 'include'
      });
    });

    it('should throw error when deletion fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(deleteBlogEntry('123')).rejects.toThrow('Failed to delete blog entry');
      expect(console.error).toHaveBeenCalled();
    });
  });
});
