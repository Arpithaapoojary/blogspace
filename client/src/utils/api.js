import axios from 'axios';

let apiURL = 'http://localhost:5000/api';
if (import.meta.env.VITE_API_URL) {
  apiURL = import.meta.env.VITE_API_URL;
} else if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
  // If accessing via local network IP (e.g., from a phone)
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(window.location.hostname)) {
    apiURL = `http://${window.location.hostname}:5000/api`;
  } else {
    // If deployed on Vercel without VITE_API_URL, assume same domain /api
    apiURL = '/api';
  }
}

const api = axios.create({
  baseURL: apiURL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const userData = localStorage.getItem('blogspace_user');
  if (userData) {
    const { token } = JSON.parse(userData);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('blogspace_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
