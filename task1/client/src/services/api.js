import axios from 'axios';

const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token to every request
api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('novamart_user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch {
        // ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('novamart_user');
      // Optionally redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
