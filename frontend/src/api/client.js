import axios from 'axios';

const apiBase = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');
const baseURL = apiBase ? `${apiBase}/api` : '/api';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
