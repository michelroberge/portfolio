import { fetchBlogEntry, createBlogEntry, updateBlogEntry, deleteBlogEntry } from '@/services/blogService';
import { PUBLIC_API, ADMIN_API } from '@/lib/constants';
import { BlogEntry } from '@/models/BlogEntry';

describe('Blog Service', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockBlog: BlogEntry = {
    _id: '123',
    title: 'Test Blog',
    excerpt: 'Test excerpt',
    body: 'Test body content',
    tags: ['test'],
    isDraft: false,
    link: 'test-blog',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  describe('fetchBlogEntry', () => {
    it('should fetch blog entry correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBlog),
      });

      const result = await fetchBlogEntry('123');

      expect(mockFetch).toHaveBeenCalledWith(PUBLIC_API.blog.get('123'), {
        credentials: 'include',
      });
      expect(result).toEqual(mockBlog);
    });

    it('should handle errors correctly', async () => {
      const errorMessage = 'Blog not found';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: errorMessage }),
      });

      await expect(fetchBlogEntry('123')).rejects.toThrow(errorMessage);
    });
  });

  describe('createBlogEntry', () => {
    const newBlog = {
      title: 'New Blog',
      excerpt: 'New excerpt',
      body: 'New body content',
      tags: ['new'],
      isDraft: true,
      link: 'new-blog',
    };

    it('should create blog entry correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBlog),
      });

      const result = await createBlogEntry(newBlog);

      expect(mockFetch).toHaveBeenCalledWith(ADMIN_API.blog.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newBlog),
      });
      expect(result).toEqual(mockBlog);
    });

    it('should handle errors correctly', async () => {
      const errorMessage = 'Failed to create blog';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: errorMessage }),
      });

      await expect(createBlogEntry(newBlog)).rejects.toThrow(errorMessage);
    });
  });

  describe('updateBlogEntry', () => {
    const updateData = {
      title: 'Updated Blog',
      excerpt: 'Updated excerpt',
      body: 'Updated body content',
    };

    it('should update blog entry correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockBlog, ...updateData }),
      });

      const result = await updateBlogEntry('123', updateData);

      expect(mockFetch).toHaveBeenCalledWith(ADMIN_API.blog.update('123'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual({ ...mockBlog, ...updateData });
    });

    it('should handle errors correctly', async () => {
      const errorMessage = 'Failed to update blog';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: errorMessage }),
      });

      await expect(updateBlogEntry('123', updateData)).rejects.toThrow(errorMessage);
    });
  });

  describe('deleteBlogEntry', () => {
    it('should delete blog entry correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await deleteBlogEntry('123');

      expect(mockFetch).toHaveBeenCalledWith(ADMIN_API.blog.delete('123'), {
        method: 'DELETE',
        credentials: 'include',
      });
    });

    it('should handle errors correctly', async () => {
      const errorMessage = 'Failed to delete blog';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: errorMessage }),
      });

      await expect(deleteBlogEntry('123')).rejects.toThrow(errorMessage);
    });
  });
});
