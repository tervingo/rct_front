import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decodificar el token JWT para obtener la información
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        console.log('Token decodificado:', tokenData);
        
        setIsAdmin(tokenData.is_admin);
        setUser({ 
          username: tokenData.sub,
          is_admin: tokenData.is_admin 
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/token`, 
        new URLSearchParams({
          username,
          password,
        }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      
      // Decodificar el token JWT para obtener la información
      const tokenData = JSON.parse(atob(access_token.split('.')[1]));
      console.log('Token después de login:', tokenData);
      
      setIsAdmin(tokenData.is_admin);
      setUser({ 
        username: tokenData.sub,
        is_admin: tokenData.is_admin 
      });
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isAdmin,
      user,
      login,
      logout,
      isLoading
    }}>
      {!isLoading && children}
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
