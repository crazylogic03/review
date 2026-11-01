const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('peerreview_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  let data;
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      data = { error: 'Invalid JSON response from server' };
    }
  } else {
    const text = await res.text();
    data = res.ok
      ? { message: text }
      : { error: text || `HTTP error ${res.status}: ${res.statusText || 'Request failed'}` };
  }

  if (!res.ok) throw new Error(data.error || `Request failed with status ${res.status}`);
  return data;
}

export const api = {
  // Auth
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),

  // Assignments
  getAssignments: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/assignments${qs ? `?${qs}` : ''}`);
  },
  getAssignment: (id) => request(`/assignments/${id}`),
  createAssignment: (body) => request('/assignments', { method: 'POST', body: JSON.stringify(body) }),
  getMyAssignments: () => request('/assignments/user/me'),
  deleteAssignment: (id) => request(`/assignments/${id}`, { method: 'DELETE' }),
  getSubjects: () => request('/assignments/meta/subjects'),

  // Reviews
  createReview: (body) => request('/reviews', { method: 'POST', body: JSON.stringify(body) }),
  getMyReviews: () => request('/reviews/user/me'),
  getReceivedReviews: () => request('/reviews/received'),

  // Users
  getUserProfile: (id) => request(`/users/${id}`),
  updateProfile: (body) => request('/users/me', { method: 'PATCH', body: JSON.stringify(body) }),
  getMyStats: () => request('/users/me/stats'),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAdminUsers: () => request('/admin/users'),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),

  // Security Demo
  runSecurityDemo: () => request('/security/demo', { method: 'POST' }),
};
