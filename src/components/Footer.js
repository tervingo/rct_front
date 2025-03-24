import React from 'react';

const Footer = () => {
    return (
      <footer className="footer">
        <div className="footer-content">
            <div className="footer-content-item">
            © 2025 Recetas del grillo
            </div>
          <a 
            href="mailto:j4alonso@gmail.com" 
            className="mail-link"
            title="Enviar correo"
        >
          <i className="fas fa-envelope"></i>
        </a>
        <p>Contacto</p>
        </div>
      </footer>
    );
  };

export default Footer;