import { fetchProject, createProject, updateProject, deleteProject } from '@/services/projectService';
import { PUBLIC_API, ADMIN_API } from '@/lib/constants';
import { Project, ProjectCreate } from '@/models/Project';

describe('Project Service', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockProject: Project = {
    _id: '123',
    title: 'Test Project',
    excerpt: 'Test excerpt',
    description: 'Test description',
    tags: ['test'],
    isDraft: false,
    status: 'completed',
    technologies: ['React', 'TypeScript'],
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    image: 'test-image.jpg',
    link: 'https://test-project.com',
    industry: 'Technology',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  describe('fetchProject', () => {
    it('should fetch project correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProject),
      });

      const result = await fetchProject('123');

      expect(mockFetch).toHaveBeenCalledWith(PUBLIC_API.project.get('123'), {
        credentials: 'include',
      });
      expect(result).toEqual(mockProject);
    });

    it('should handle errors correctly', async () => {
      const errorMessage = 'Project not found';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: errorMessage }),
      });

      await expect(fetchProject('123')).rejects.toThrow(errorMessage);
    });
  });

  describe('createProject', () => {
    const newProject: ProjectCreate = {
      title: 'New Project',
      excerpt: 'New excerpt',
      description: 'New description',
      tags: ['new'],
      isDraft: true,
      status: 'planned',
      technologies: ['Next.js', 'TypeScript'],
      industry: 'Education',
    };

    it('should create project correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProject),
      });

      const result = await createProject(newProject);

      expect(mockFetch).toHaveBeenCalledWith(ADMIN_API.project.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newProject),
      });
      expect(result).toEqual(mockProject);
    });

    it('should handle errors correctly', async () => {
      const errorMessage = 'Failed to create project';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: errorMessage }),
      });

      await expect(createProject(newProject)).rejects.toThrow(errorMessage);
    });
  });

  describe('updateProject', () => {
    const updateData = {
      title: 'Updated Project',
      excerpt: 'Updated excerpt',
      description: 'Updated description',
      status: 'in-progress' as const,
    };

    it('should update project correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockProject, ...updateData }),
      });

      const result = await updateProject('123', updateData);

      expect(mockFetch).toHaveBeenCalledWith(ADMIN_API.project.update('123'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual({ ...mockProject, ...updateData });
    });

    it('should handle errors correctly', async () => {
      const errorMessage = 'Failed to update project';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: errorMessage }),
      });

      await expect(updateProject('123', updateData)).rejects.toThrow(errorMessage);
    });
  });

  describe('deleteProject', () => {
    it('should delete project correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await deleteProject('123');

      expect(mockFetch).toHaveBeenCalledWith(ADMIN_API.project.delete('123'), {
        method: 'DELETE',
        credentials: 'include',
      });
    });

    it('should handle errors correctly', async () => {
      const errorMessage = 'Failed to delete project';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: errorMessage }),
      });

      await expect(deleteProject('123')).rejects.toThrow(errorMessage);
    });
  });
});
