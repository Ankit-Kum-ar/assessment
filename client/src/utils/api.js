import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://assessment-c3hi.onrender.com',
  withCredentials: true, // Important: This allows cookies to be sent and received
  // headers: {
  //   'Content-Type': 'application/json'
  // }
});

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // 401 Unauthorized - User needs to login again
      window.location.href = '/login'; // Hard redirect to ensure all state is reset
    }
    return Promise.reject(error);
  }
);

export default api;
