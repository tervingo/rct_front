import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-content">
        <p>
          Este sitio web utiliza cookies para mejorar tu experiencia. 
          Al continuar navegando aceptas nuestra{' '}
          <Link to="/cookies">política de cookies</Link>.
        </p>
        <button onClick={handleAccept} className="cookie-accept-btn">
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default CookieBanner; 