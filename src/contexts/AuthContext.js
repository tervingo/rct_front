import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Limpiar cualquier token existente en localStorage
    localStorage.removeItem('token');
    
    // Solo verificar sessionStorage
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(tokenData.is_admin || false);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        // Si hay error al decodificar, limpiar la sesión
        sessionStorage.removeItem('token');
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    }
  }, []);

  const login = async (formData) => {
    try {
      // Limpiar cualquier token existente antes de hacer login
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');

      const response = await axiosInstance.post('/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token } = response.data;
      
      // Guardar solo en sessionStorage
      sessionStorage.setItem('token', access_token);
      
      const tokenData = JSON.parse(atob(access_token.split('.')[1]));
      setIsAdmin(tokenData.is_admin || false);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error en la petición:', error.response?.data);
      console.error('Error de login:', error);
      throw error;
    }
  };

  const logout = (navigate) => {
    // Limpiar ambos storages por seguridad
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsAdmin(false);
    if (navigate) {
      navigate('/');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
