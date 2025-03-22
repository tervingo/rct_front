import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  
  console.log('Navbar estado:', { isAuthenticated, isAdmin, user });

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-brand">
          <span>Entre fogones</span>
        </Link>
        <img src="/cuchara.jpg" alt="Recetarium" className="navbar-logo" />
      </div>
      <div className="nav-right">
        {isAuthenticated && (
          <>
            <Link to="/new" className="nav-link">Nueva receta</Link>
            {isAdmin && (
              <Link to="/admin/users" className="nav-link">
                Administrar Usuarios
              </Link>
            )}
            <span className="nav-user">Hola, {user?.username}</span>
            <button onClick={logout} className="nav-link">
              Cerrar sesión
            </button>
          </>
        )}
        {!isAuthenticated && (
          <Link to="/login" className="nav-link">Administrar web</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
