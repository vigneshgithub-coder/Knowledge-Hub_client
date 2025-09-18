import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://ai-knowledge-hub-api.onrender.com/'  // Replace with your actual Render URL
    : '',  // In development, this will use the proxy from package.json
  withCredentials: true,  // Important for including cookies in requests if using HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
