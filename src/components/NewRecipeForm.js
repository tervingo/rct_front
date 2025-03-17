import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewRecipeForm = () => {
  const navigate = useNavigate();

  const handleCancel = (e) => {
    e.preventDefault();
    if (window.confirm('¿Estás seguro de que quieres cancelar? Los datos no guardados se perderán.')) {
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* ... otros campos del formulario ... */}
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
        <button onClick={handleCancel} className="btn btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default NewRecipeForm; 