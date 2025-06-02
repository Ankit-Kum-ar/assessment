import axios from 'axios';

const api = axios.create({
  baseURL: "https://ey-backend-xtii.onrender.com",
  withCredentials: true, // Keep this for cookies
  headers: {
    'Content-Type': 'application/json'
  },
});

// Add an interceptor to include the token from localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
