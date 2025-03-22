import axios from 'axios';
import { BACKEND_URL } from '../constants';

const axiosInstance = axios.create({
  baseURL: BACKEND_URL
});

// Log para ver las peticiones
axiosInstance.interceptors.request.use(request => {
  console.log('Realizando petición:', {
    url: request.url,
    method: request.method,
    headers: request.headers
  });
  const token = localStorage.getItem('token');
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

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
    if (error.response?.status === 401) {
      // Si recibimos un 401, el token no es válido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
