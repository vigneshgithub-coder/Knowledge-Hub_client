import axios from 'axios';

const api = axios.create({
  // baseURL is proxied by CRA via package.json "proxy"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
