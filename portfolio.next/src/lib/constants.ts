export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
export const REMOTE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export const API_BASE = "/api";

// Public API endpoints (no auth required)
export const PUBLIC_API = {
  blog: {
    list: `${REMOTE_URL}${API_BASE}/blogs`,
    get: (id: string) => `${REMOTE_URL}${API_BASE}/blogs/${id}`,
    search: (query: string) => `${REMOTE_URL}${API_BASE}/blogs/search?q=${encodeURIComponent(query)}`,
  },
  project: {
    list: `${REMOTE_URL}${API_BASE}/projects`,
    get: (id: string) => `${REMOTE_URL}${API_BASE}/projects/${id}`,
    search: (query: string) => `${REMOTE_URL}${API_BASE}/projects/search?q=${encodeURIComponent(query)}`,
  },
  career: {
    list: `${REMOTE_URL}${API_BASE}/career/timeline`,
    get: (id: string) => `${REMOTE_URL}${API_BASE}/career/timeline/${id}`,
  },
  page: {
    list: `${REMOTE_URL}${API_BASE}/pages`,
    get: (id: string) => `${REMOTE_URL}${API_BASE}/pages/${id}`,
  },
  file: {
    list: `${REMOTE_URL}${API_BASE}/files`,
    get: (id: string) => `${REMOTE_URL}${API_BASE}/files/${id}`,
  },
  home: {
    get: `${REMOTE_URL}${API_BASE}/home`,
    search: (query: string) => `${REMOTE_URL}${API_BASE}/home/search?q=${query}`,
  },
  comment: {
    list: `${REMOTE_URL}${API_BASE}/comments`,
    get: (id: string) => `${REMOTE_URL}${API_BASE}/comments/${id}`,
  },
  search: `${REMOTE_URL}${API_BASE}/search`,
} as const;

// Protected API endpoints (require authentication)
export const AUTH_API = {
  auth: {
    login: `${REMOTE_URL}${API_BASE}/auth/login`,
    logout: `${REMOTE_URL}${API_BASE}/auth/logout`,
    status: `${REMOTE_URL}${API_BASE}/auth/status`,
    oauth: {
      google: `${REMOTE_URL}${API_BASE}/auth/oauth2/google`,
      facebook: `${REMOTE_URL}${API_BASE}/auth/oauth2/facebook`,
    }
  },
  chat: `${REMOTE_URL}${API_BASE}/chat`,
  comment: {
    create: `${REMOTE_URL}${API_BASE}/comments`,
    update: (id: string) => `${REMOTE_URL}${API_BASE}/comments/${id}`,
    delete: (id: string) => `${REMOTE_URL}${API_BASE}/comments/${id}`,
  },
} as const;

// Admin API endpoints (require authentication and admin role)
export const ADMIN_API = {
  blog: {
    create: `${REMOTE_URL}${API_BASE}/blogs`,
    update: (id: string) => `${REMOTE_URL}${API_BASE}/blogs/${id}`,
    delete: (id: string) => `${REMOTE_URL}${API_BASE}/blogs/${id}`,
    generateEmbeddings: `${REMOTE_URL}${API_BASE}/blogs/generate-embeddings`,
  },
  project: {
    create: `${REMOTE_URL}${API_BASE}/projects`,
    update: (id: string) => `${REMOTE_URL}${API_BASE}/projects/${id}`,
    delete: (id: string) => `${REMOTE_URL}${API_BASE}/projects/${id}`,
    archive: (id: string) => `${REMOTE_URL}${API_BASE}/projects/${id}/archive`,
  },
  career: {
    create: `${REMOTE_URL}${API_BASE}/career/timeline`,
    update: (id: string) => `${REMOTE_URL}${API_BASE}/career/timeline/${id}`,
    delete: (id: string) => `${REMOTE_URL}${API_BASE}/career/timeline/${id}`,
    addLink: (id: string) => `${REMOTE_URL}${API_BASE}/career/timeline/${id}/link`,
    parseLinkedIn: `${REMOTE_URL}${API_BASE}/career/parse-linkedin`,
    bulkImport: `${REMOTE_URL}${API_BASE}/career/timeline/bulk`,
  },
  file: {
    upload: `${REMOTE_URL}${API_BASE}/files/upload`,
    update: (id: string) => `${REMOTE_URL}${API_BASE}/files/${id}`,
    delete: (id: string) => `${REMOTE_URL}${API_BASE}/files/${id}`,
  },
  page: {
    create: `${REMOTE_URL}${API_BASE}/pages`,
    update: (id: string) => `${REMOTE_URL}${API_BASE}/pages/${id}`,
    delete: (id: string) => `${REMOTE_URL}${API_BASE}/pages/${id}`,
  },
  user: {
    list: `${REMOTE_URL}${API_BASE}/users`,
    create: `${REMOTE_URL}${API_BASE}/users`,
    update: (id: string) => `${REMOTE_URL}${API_BASE}/users/${id}`,
    delete: (id: string) => `${REMOTE_URL}${API_BASE}/users/${id}`,
    updateAdmin: (id: string) => `${REMOTE_URL}${API_BASE}/users/${id}/admin`,
    adminExists: `${REMOTE_URL}${API_BASE}/users/admin-exists`,
    initialize: `${REMOTE_URL}${API_BASE}/users/initialize`,
  },
  providerConfig: {
    list: `${REMOTE_URL}${API_BASE}/provider-configs`,
    get: (provider: string) => `${REMOTE_URL}${API_BASE}/provider-configs/${provider}`,
    create: `${REMOTE_URL}${API_BASE}/provider-configs`,
    update: (id: string) => `${REMOTE_URL}${API_BASE}/provider-configs/${id}`,
    delete: (id: string) => `${REMOTE_URL}${API_BASE}/provider-configs/${id}`,
  },
  analytics: {
    list: `${REMOTE_URL}${API_BASE}/analytics`,
    trackPage: `${REMOTE_URL}${API_BASE}/analytics/track-page`,
    trackEvent: `${REMOTE_URL}${API_BASE}/analytics/track-event`,
    telemetry: `${REMOTE_URL}${API_BASE}/analytics/telemetry`,
  },
  ai: {
    complete: `${REMOTE_URL}${API_BASE}/ai/complete`,
    embeddings: `${REMOTE_URL}${API_BASE}/ai/embeddings`,
    similaritySearch: `${REMOTE_URL}${API_BASE}/ai/similarity-search`,
    config: `${REMOTE_URL}${API_BASE}/ai/config`,
    initialize: `${REMOTE_URL}${API_BASE}/ai/initialize`,
  },
  comment: {
    list: `${REMOTE_URL}${API_BASE}/comments/all`,
    delete: (id: string) => `${REMOTE_URL}${API_BASE}/comments/${id}`,
  },
} as const;

// Frontend routes
export const APP_ROUTES = {
  auth: {
    login: '/admin/login',
  },
  admin: {
    home: '/admin',
    blogs: {
      list: '/admin/blogs',
      create: '/admin/blogs/create',
      edit: (id: string) => `/admin/blogs/edit/${id}`,
    },
    projects: {
      list: '/admin/projects',
      create: '/admin/projects/create',
      edit: (id: string) => `/admin/projects/edit/${id}`,
    },
    pages: {
      list: '/admin/pages',
      create: '/admin/pages/create',
      edit: (id: string) => `/admin/pages/edit/${id}`,
    },
    career: {
      list: '/admin/career',
      create: '/admin/career/create',
      edit: (id: string) => `/admin/career/edit/${id}`,
    },
    users: {
      list: '/admin/users',
      create: '/admin/users/create',
      edit: (id: string) => `/admin/users/edit/${id}`,
    },
    settings: '/admin/settings',
  },
} as const;
