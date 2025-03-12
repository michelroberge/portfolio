export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
export const REMOTE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export const API_BASE = "/api";

export const API_ENDPOINTS = {
  blog: `${REMOTE_URL}${API_BASE}/blogs`,
  project: `${REMOTE_URL}${API_BASE}/projects`,
  page: `${REMOTE_URL}${API_BASE}/pages`,
  auth: `${REMOTE_URL}${API_BASE}/auth`,
  chat: `${REMOTE_URL}${API_BASE}/chat`,
  search: `${REMOTE_URL}${API_BASE}/search`,
  comment: `${REMOTE_URL}${API_BASE}/comments`,
  admin: {
    blogs: `${REMOTE_URL}${API_BASE}/admin/blogs`,
    projects: `${REMOTE_URL}${API_BASE}/admin/projects`,
    pages: `${REMOTE_URL}${API_BASE}/admin/pages`,
    users: `${REMOTE_URL}${API_BASE}/admin/users`,
    providerConfigs: `${REMOTE_URL}${API_BASE}/admin/provider-configs`,
    career: `${REMOTE_URL}${API_BASE}/admin/career`,
    comments: `${REMOTE_URL}${API_BASE}/admin/comments`,
  },
  providerConfig: `${REMOTE_URL}${API_BASE}/provider-configs`,
  career: `${REMOTE_URL}${API_BASE}/career`,
  file: `${REMOTE_URL}${API_BASE}/files`,
  analytics: {
    telemetry: `${REMOTE_URL}${API_BASE}/telemetry`,
  },
} as const;

export const APP_ROUTES = {
  auth: {
    login: '/admin/login',
  },
  admin: {
    blogs: '/admin/blogs',
    blogEdit: (id: string) => `/admin/blogs/edit/${id}`,
    projects: '/admin/projects',
    pages: '/admin/pages',
    users: '/admin/users',
    settings: '/admin/settings',
    career: '/admin/career',
  },
} as const;
