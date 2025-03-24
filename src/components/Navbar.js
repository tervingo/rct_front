import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  
  console.log('Navbar estado:', { isAuthenticated, isAdmin, user });
  console.log('Navbar user object:', user);

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-brand">
          <span>Recetas del grillo</span>
        </Link>
        <img src="/cuchara.jpg" alt="Recetarium" className="navbar-cuchara" />
        <img src="/grillo.png" alt="Grillo" className="navbar-grillo" />
      </div>
      <div className="navbar-cita-container"> 
        <div className="navbar-cita">"De lo que come el grillo, poquillo"</div>
        <div className="navbar-cita-explicacion">Chascarrillo popular del que tampoco hay que hacer mucho caso</div>
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
            <button onClick={handleLogout} className="nav-link">
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
