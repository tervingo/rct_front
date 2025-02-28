import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const BACKEND_URL = 'https://recetarium-back.onrender.com';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('RecipeList component mounted');
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/recipes/`);
      console.log('Respuesta recibida:', response.data);
      if (!Array.isArray(response.data)) {
        console.error('Los datos recibidos no son un array:', response.data);
        toast.error('Formato de datos inválido del servidor');
        return;
      }
      setRecipes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener las recetas:', error);
      const errorMessage = error.response 
        ? `Error: ${error.response.status} - ${error.response.data.detail || error.response.data}`
        : 'Error al conectar con el servidor';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
      try {
        await axios.delete(`${BACKEND_URL}/recipes/${id}`);
        toast.success('Receta eliminada correctamente');
        fetchRecipes(); // Actualizar la lista
      } catch (error) {
        console.error('Error al eliminar la receta:', error);
        toast.error('Error al eliminar la receta');
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando recetas...</div>;
  }

  return (
    <div className="recipe-list">
      <h2 className='recipe-list-title'>Lista de recetas</h2>
      <Link to="/new" className="btn btn-primary add-recipe-btn">
        Añadir Nueva Receta
      </Link>
      
      <div className="recipe-grid">
        {recipes.length === 0 ? (
          <p className="no-recipes">No hay recetas. ¡Añade tu primera receta!</p>
        ) : (
          recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              {recipe.image_path && (
                <div className="recipe-image">
                  <img src={`${BACKEND_URL}${recipe.image_path}`} alt={recipe.title} />
                </div>
              )}
              <h3>{recipe.title}</h3>
              <p className="recipe-description">{recipe.description}</p>
              <div className="recipe-meta">
                <span>🕒 {recipe.cooking_time} minutos</span>
                <span>👥 {recipe.servings} personas</span>
              </div>
              <div className="recipe-category">
                <span>📑 {recipe.category}</span>
              </div>
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="recipe-tags">
                  {recipe.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              )}
              <div className="recipe-actions">
                <Link to={`/recipe/${recipe.id}`} className="btn btn-secondary">
                  Ver
                </Link>
                <Link to={`/recipe/${recipe.id}/edit`} className="btn btn-primary">
                  Editar
                </Link>
                <button 
                  onClick={() => handleDelete(recipe.id)} 
                  className="btn btn-danger"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecipeList;