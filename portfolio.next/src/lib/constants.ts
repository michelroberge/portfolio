export const REMOTE_URL : string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export const API_BASE : string = "/api";
export const API_ENDPOINTS = {
    blog: `${REMOTE_URL}${API_BASE}/blogs`,
    project: `${REMOTE_URL}${API_BASE}/projects`,
    page: `${REMOTE_URL}${API_BASE}/pages`,
    auth: `${REMOTE_URL}${API_BASE}/auth`,
    chat: `${REMOTE_URL}${API_BASE}/chat`,
    search: `${REMOTE_URL}${API_BASE}/search`,
    providerConfig: `${REMOTE_URL}${API_BASE}/provider-configs`,
    career:  `${REMOTE_URL}${API_BASE}/career`,
    file:  `${REMOTE_URL}${API_BASE}/files`,    
}
