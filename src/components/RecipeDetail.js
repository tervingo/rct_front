import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../utils/axios';
import { toast } from 'react-toastify';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecipe = async () => {
      setIsLoading(true);
      try {
        console.log('Intentando cargar receta con ID:', id);
        const response = await axiosInstance.get(`/recipes/${id}`);
        console.log('Respuesta completa:', response);
        console.log('Datos de la receta:', response.data);
        
        if (response.data) {
          setRecipe(response.data);
        } else {
          console.log('No se recibieron datos de la receta');
          toast.error('No se encontró la receta');
        }
      } catch (error) {
        console.error('Error al cargar la receta:', error);
        console.error('Detalles del error:', error.response?.data);
        console.error('Estado de la respuesta:', error.response?.status);
        toast.error('Error al cargar la receta');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      console.log('ID de la receta a cargar:', id);
      loadRecipe();
    }
  }, [id]);

  useEffect(() => {
    console.log('Estado actual de recipe:', recipe);
  }, [recipe]);

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
      try {
        await axiosInstance.delete(`/recipes/${id}`);
        toast.success('Receta eliminada correctamente');
        navigate('/');
      } catch (error) {
        console.error('Error al eliminar la receta:', error);
        toast.error('Error al eliminar la receta');
      }
    }
  };

  if (isLoading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!recipe) {
    return <div className="error">No se encontró la receta</div>;
  }

  return (
    <div className="recipe-detail">
      <div className="recipe-header">
        <h2>{recipe.title}</h2>
        {isAuthenticated && (
          <div className="recipe-admin-actions">
            <Link 
              to={`/recipe/${recipe._id}/edit`}
              className="btn btn-edit"
            >
              Editar
            </Link>
            <button 
              onClick={handleDelete}
              className="btn btn-delete"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>

      {recipe.image_path && (
        <div className="recipe-image-container">
          <img 
            src={recipe.image_path} 
            alt={recipe.title} 
            className="recipe-image"
          />
        </div>
      )}

      <div className="recipe-content">
        <div className="recipe-description">
          <h3>Descripción</h3>
          <p>{recipe.description}</p>
        </div>

        <div className="recipe-comment">
          <h3>Comentario</h3>
          <p>{recipe.comment}</p>
        </div>

        <div className="recipe-metadata">
          <span><i className="far fa-clock"></i> {recipe.cooking_time} minutos</span>
          <span><i className="fas fa-user-friends"></i> {recipe.servings} personas</span>
          <span><i className="fas fa-tag"></i> {recipe.category}</span>
        </div>

        <div className="recipe-section">
          <h3>Ingredientes</h3>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div className="recipe-section">
          <h3>Instrucciones</h3>
          <ol>
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="recipe-tags">
            <h3>Etiquetas</h3>
            <div className="tags-container">
              {Array.from(recipe.tags).map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="recipe-footer">
        <button 
          onClick={() => navigate('/')}
          className="btn btn-secondary"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default RecipeDetail;