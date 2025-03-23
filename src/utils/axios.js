import axios from 'axios';
import { BACKEND_URL } from '../constants';

const axiosInstance = axios.create({
  baseURL: BACKEND_URL
});

// Log para ver las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Realizando petición:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    // Usar solo sessionStorage
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Si los datos son FormData, asegurarse de que el Content-Type sea correcto
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Log para ver las respuestas
axiosInstance.interceptors.response.use(
  response => {
    console.log('Respuesta recibida:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('Error en la petición:', {
      status: error.response?.status,
      data: error.response?.data
    });
    if (error.response && error.response.status === 401) {
      // Si hay error de autenticación, limpiar ambos storages
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
