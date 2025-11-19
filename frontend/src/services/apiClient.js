import axios from 'axios';

// Create a single axios instance for the whole app
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend URL
});

// Interceptor: Automatically adds the Authorization header if a token exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;