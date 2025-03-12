import { fetchFiles, uploadFile, deleteFile } from '@/services/fileService';
import { API_ENDPOINTS } from '@/lib/constants';
import { FileInfo } from '@/models/FileInfo';

// Mock the global fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock console.error to prevent logging during tests
console.error = jest.fn();

describe('File Service', () => {
  const mockFileInfo: FileInfo = {
    _id: '67cb0ebf2ec18c7799cb6e99',
    filename: 'test-file.jpg',
    originalName: 'test-file.jpg',
    contentType: 'image/jpeg',
    isPublic: true,
    context: 'project',
    size: 4004,
    length: 4004,
    chunkSize: 261120,
    uploadDate: '2025-03-07T15:20:31.656Z',
    metadata: {
      entityId: '67bb7eb8a3e8ac56032b8378',
      context: 'project',
      uploadedBy: 'testuser',
      isPublic: true,
      size: 4004,
      uploadDate: '2025-03-07T15:20:31.656Z'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchFiles', () => {
    it('should fetch files without filters', async () => {
      const mockFiles = [mockFileInfo];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFiles)
      });

      const result = await fetchFiles();

      expect(mockFetch).toHaveBeenCalledWith(API_ENDPOINTS.file, {
        credentials: 'include'
      });
      expect(result).toEqual(mockFiles);
    });

    it('should fetch files with entityId and context', async () => {
      const mockFiles = [mockFileInfo];
      const entityId = '67bb7eb8a3e8ac56032b8378';
      const context = 'project';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFiles)
      });

      const result = await fetchFiles(entityId, context);
      const expectedUrl = new URL(API_ENDPOINTS.file);
      expectedUrl.searchParams.append('entityId', entityId);
      expectedUrl.searchParams.append('context', context);

      expect(mockFetch).toHaveBeenCalledWith(expectedUrl.toString(), {
        credentials: 'include'
      });
      expect(result).toEqual(mockFiles);
    });

    it('should return empty array when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      const result = await fetchFiles();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle network errors and return empty array', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchFiles();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('uploadFile', () => {
    const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const entityId = '67bb7eb8a3e8ac56032b8378';
    const context = 'project';
    const isPublic = true;

    it('should upload file successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFileInfo)
      });

      const result = await uploadFile(mockFile, entityId, context, isPublic);

      const expectedUrl = new URL(`${API_ENDPOINTS.file}/upload`);
      expectedUrl.searchParams.append('entityId', entityId);
      expectedUrl.searchParams.append('context', context);
      expectedUrl.searchParams.append('isPublic', isPublic.toString());

      const expectedFormData = new FormData();
      expectedFormData.append('file', mockFile);
      expectedFormData.append('context', context);
      expectedFormData.append('entityId', entityId);
      expectedFormData.append('isPublic', isPublic.toString());

      expect(mockFetch).toHaveBeenCalledWith(expectedUrl.toString(), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'content-type': 'multipart/form-data',
          'x-filename': mockFile.name
        },
        body: expect.any(FormData)
      });
      expect(result).toEqual(mockFileInfo);
    });

    it('should throw error when upload fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(uploadFile(mockFile, entityId, context, isPublic))
        .rejects.toThrow('Upload failed');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(uploadFile(mockFile, entityId, context, isPublic))
        .rejects.toThrow(networkError);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('deleteFile', () => {
    const fileId = '67cb0ebf2ec18c7799cb6e99';

    it('should delete file successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true
      });

      await deleteFile(fileId);

      expect(mockFetch).toHaveBeenCalledWith(`${API_ENDPOINTS.file}/${fileId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
    });

    it('should throw error when deletion fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(deleteFile(fileId)).rejects.toThrow('Failed to delete');
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(deleteFile(fileId)).rejects.toThrow(networkError);
      expect(console.error).toHaveBeenCalled();
    });
  });
});
