import { getProject, getProjects, createProject, updateProject, archiveProject, deleteProject } from '@/services/projectService';
import { API_ENDPOINTS } from '@/lib/constants';
import { Project, ProjectCreate } from '@/models/Project';

// Mock the global fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock console.error to prevent logging during tests
console.error = jest.fn();

describe('projectService', () => {
  const mockProject: Project = {
    _id: '123',
    title: 'Test Project',
    excerpt: 'Test Excerpt',
    description: 'Test Description',
    tags: ['test'],
    isDraft: false,
    status: 'in-progress',
    technologies: ['react', 'typescript'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProject', () => {
    it('should fetch a single project successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProject)
      });

      const result = await getProject('123');

      expect(mockFetch).toHaveBeenCalledWith(`${API_ENDPOINTS.project}/123`, {
        credentials: 'include'
      });
      expect(result).toEqual(mockProject);
    });

    it('should return null when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      const result = await getProject('123');

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle network errors and return null', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await getProject('123');

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getProjects', () => {
    it('should fetch all projects successfully', async () => {
      const mockProjects = [mockProject];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProjects)
      });

      const result = await getProjects();

      expect(mockFetch).toHaveBeenCalledWith(API_ENDPOINTS.project, {
        credentials: 'include'
      });
      expect(result).toEqual(mockProjects);
    });

    it('should return empty array when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      const result = await getProjects();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('createProject', () => {
    const newProject: ProjectCreate = {
      title: 'New Project',
      excerpt: 'New Excerpt',
      description: 'New Description',
      tags: ['new'],
      isDraft: true,
      status: 'planned',
      technologies: ['node', 'typescript']
    };

    it('should create a project successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProject)
      });

      const result = await createProject(newProject);

      expect(mockFetch).toHaveBeenCalledWith(API_ENDPOINTS.project, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProject,
          status: 'planned',
          technologies: ['node', 'typescript']
        }),
        credentials: 'include'
      });
      expect(result).toEqual(mockProject);
    });

    it('should throw error when creation fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(createProject(newProject)).rejects.toThrow('Failed to create project');
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('updateProject', () => {
    const updateData: Partial<Project> = {
      title: 'Updated Project',
      status: 'completed'
    };

    it('should update a project successfully', async () => {
      const updatedProject = { ...mockProject, ...updateData };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedProject)
      });

      const result = await updateProject('123', updateData);

      expect(mockFetch).toHaveBeenCalledWith(`${API_ENDPOINTS.project}/123`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
        credentials: 'include'
      });
      expect(result).toEqual(updatedProject);
    });

    it('should throw error when update fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(updateProject('123', updateData)).rejects.toThrow('Failed to update project');
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('archiveProject', () => {
    it('should archive a project successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true
      });

      await archiveProject('123');

      expect(mockFetch).toHaveBeenCalledWith(`${API_ENDPOINTS.project}/123/archive`, {
        method: 'PUT',
        credentials: 'include'
      });
    });

    it('should throw error when archive fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(archiveProject('123')).rejects.toThrow('Failed to archive project');
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('deleteProject', () => {
    it('should delete a project successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true
      });

      await deleteProject('123');

      expect(mockFetch).toHaveBeenCalledWith(`${API_ENDPOINTS.project}/123`, {
        method: 'DELETE',
        credentials: 'include'
      });
    });

    it('should throw error when deletion fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(deleteProject('123')).rejects.toThrow('Failed to delete project');
      expect(console.error).toHaveBeenCalled();
    });
  });
});
