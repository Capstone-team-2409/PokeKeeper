import axios from 'axios';
import { refreshToken } from './authService';

const baseURL = 'https://pokekeeper.onrender.com'; 
const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshToken();
      if (newToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } else {
        console.log('Redirecting to login...');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
