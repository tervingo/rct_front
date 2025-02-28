import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/recipes/${id}`);
      setRecipe(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar la receta:', error);
      toast.error('Error al cargar la receta');
      navigate('/');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
      try {
        await axios.delete(`${BACKEND_URL}/recipes/${id}`);
        toast.success('Receta eliminada correctamente');
        navigate('/');
      } catch (error) {
        console.error('Error al eliminar la receta:', error);
        toast.error('Error al eliminar la receta');
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando receta...</div>;
  }

  if (!recipe) {
    return <div className="error">Receta no encontrada</div>;
  }

  return (
    <div className="recipe-detail">
      {recipe.image_path && (
        <div className="recipe-detail-image">
          <img src={`${BACKEND_URL}${recipe.image_path}`} alt={recipe.title} />
        </div>
      )}

      <h2>{recipe.title}</h2>

      <section className="recipe-section">
        <h3>Descripción</h3>
        <p className="recipe-description">{recipe.description}</p>
      </section>

      {recipe.comment && (
        <section className="recipe-section">
          <h3>Comentario</h3>
          <p className="recipe-comment">{recipe.comment}</p>
        </section>
      )}

      <div className="recipe-meta">
        <span><i className="fas fa-clock"></i> {recipe.cooking_time} minutos</span>
        <span><i className="fas fa-users"></i> {recipe.servings} porciones</span>
        <span><i className="fas fa-tag"></i> {recipe.category}</span>
      </div>

      {recipe.tags && recipe.tags.length > 0 && (
        <div className="recipe-tags">
          {recipe.tags.map(tag => (
            <span key={tag} className="tag">
              <i className="fas fa-hashtag"></i> {tag}
            </span>
          ))}
        </div>
      )}
      
      <section className="recipe-section">
        <h3>Ingredientes</h3>
        <ul className="ingredients-list">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </section>
  
      <section className="recipe-section">
        <h3>Instrucciones</h3>
        <ol className="instructions-list">
          {recipe.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
      </section>
  
      <div className="recipe-actions">
        <Link to={`/recipe/${id}/edit`} className="btn btn-primary">
          <i className="fas fa-edit"></i> Editar
        </Link>
        <button onClick={handleDelete} className="btn btn-danger">
          <i className="fas fa-trash"></i> Eliminar
        </button>
        <Link to="/" className="btn btn-secondary">
          <i className="fas fa-arrow-left"></i> Volver
        </Link>
      </div>
    </div>
  );
}

export default RecipeDetail;