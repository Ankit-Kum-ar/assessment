import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5500',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // 401 Unauthorized - User needs to login again
      localStorage.removeItem('user');
      // You might want to redirect to login page here
      // or handle it in the component
    }
    return Promise.reject(error);
  }
);

export default api;
