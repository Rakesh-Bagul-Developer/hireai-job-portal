import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: data => API.post('/auth/register/', data),
  login: data => API.post('/auth/login/', data),
  logout: () => API.post('/auth/logout/'),
  getProfile: () => API.get('/auth/profile/'),
  updateProfile: data => API.patch('/auth/profile/', data),
  getSeekerProfile: () => API.get('/auth/seeker-profile/'),
  updateSeekerProfile: data => API.patch('/auth/seeker-profile/', data),
  getEmployerProfile: () => API.get('/auth/employer-profile/'),
  updateEmployerProfile: data => API.patch('/auth/employer-profile/', data),
};

export const jobsAPI = {
  list: params => API.get('/jobs/', { params }),
  featured: () => API.get('/jobs/featured/'),
  detail: id => API.get(`/jobs/${id}/`),
  create: data => API.post('/jobs/create/', data),
  update: (id, data) => API.patch(`/jobs/${id}/edit/`, data),
  delete: id => API.delete(`/jobs/${id}/edit/`),
  myJobs: () => API.get('/jobs/my-jobs/'),
  saveJob: id => API.post(`/jobs/${id}/save/`),
  savedJobs: () => API.get('/jobs/saved/'),
  categories: () => API.get('/jobs/categories/'),
};

export const appsAPI = {
  apply: data => API.post('/applications/apply/', data),
  myApplications: () => API.get('/applications/my/'),
  jobApplications: jobId => API.get(`/applications/job/${jobId}/`),
  updateStatus: (id, data) => API.patch(`/applications/${id}/status/`, data),
  notifications: () => API.get('/applications/notifications/'),
  markRead: id => API.patch(`/applications/notifications/${id}/read/`),
  markAllRead: () => API.patch('/applications/notifications/read-all/'),
  dashboard: () => API.get('/applications/dashboard/'),
};

export default API;
