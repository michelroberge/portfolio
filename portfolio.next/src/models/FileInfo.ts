export interface BaseFileInfo {
  filename: string;
  originalName: string;
  contentType: string;
  isPublic: boolean;
  context: 'blog' | 'project' | 'profile' | 'other';
  size: number;
}

export interface FileMetadata {
  entityId: string;
  context: 'blog' | 'project' | 'profile' | 'other';
  uploadedBy: string;
  isPublic: boolean;
  size: number;
  uploadDate?: string;
}

export interface FileInfo extends BaseFileInfo {
  _id: string;
  metadata: FileMetadata;
  uploadDate?: string;
  length?: number;
  chunkSize?: number;
}

/*
      {
        "_id": "67cb0ebf2ec18c7799cb6e99",
        "length": 4004,
        "chunkSize": 261120,
        "uploadDate": "2025-03-07T15:20:31.656Z",
        "filename": "uploaded_file",
        "metadata": {
            "contentType": "multipart/form-data",
            "uploadedBy": null,
            "isPublic": true,
            "entityId": "67bb7eb8a3e8ac56032b8378",
            "type": "project"
        }
*/