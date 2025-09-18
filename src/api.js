import axios from 'axios';

// Configure base URL based on environment
const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://ai-knowledge-hub-api.onrender.com'  // Your deployed backend URL
  : 'http://localhost:5000';  // Local development server

const api = axios.create({
  baseURL,
  withCredentials: true,  // Important for cookies/sessions
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (e.g., 401 Unauthorized)
    if (error.response?.status === 401) {
      // Clear invalid token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;