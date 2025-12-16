import axios from 'axios';

// Crea instancia con baseURL para proxy
const api = axios.create({
  baseURL: '/api/v1',  // Relativo para Vite proxy
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
    // LOG TEMPORAL: Para debug, muestra el error completo antes de logout
    if (error.response) {
      console.error('API Error Details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        data: error.response.data,
        headers: error.response.headers
      });
    } else {
      console.error('API Error (no response):', error.message);
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('Auth error detected: Logging out and redirecting to /login');
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      // LOG TEMPORAL: Delay de 2s para ver el error en console antes de redirect
      setTimeout(() => {
        window.location.href = '/login';  // Redirige a login
      }, 2000);
      // Remueve el setTimeout y cambia a window.location.href directo una vez debuggeado
    }
    return Promise.reject(error);
  }
);

export default api;