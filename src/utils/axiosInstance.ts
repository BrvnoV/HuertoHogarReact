import axios from 'axios';

// Crea instancia con baseURL para proxy
const api = axios.create({
  baseURL: '/api',  // Relativo para Vite proxy
});

// Interceptor para agregar JWT automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores (ej. 401/403 → logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';  // Redirige a login
    }
    return Promise.reject(error);
  }
);

export default api;