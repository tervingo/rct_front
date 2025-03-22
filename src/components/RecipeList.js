import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../utils/axios';

const CATEGORIES_ORDER = [
  ['Aperitivos', 'Tapas y Pinchos'],
  ['Primeros'],
  ['Segundos', 'Guarniciones'],
  ['Postres']
];

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsPerRow, setItemsPerRow] = useState(3);
  const containerRef = useRef(null);
  const { isAuthenticated } = useAuth();

  // Calcular cuántas tarjetas caben en una fila
  useEffect(() => {
    const calculateItemsPerRow = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth - 100; // Restar espacio para flechas
        const cardWidth = 300; // Ancho de tarjeta + márgenes
        const newItemsPerRow = Math.floor((containerWidth) / cardWidth);
        setItemsPerRow(Math.max(1, newItemsPerRow));
      }
    };

    calculateItemsPerRow();
    window.addEventListener('resize', calculateItemsPerRow);

    return () => {
      window.removeEventListener('resize', calculateItemsPerRow);
    };
  }, []);

  // Modificar la configuración del carrusel
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: itemsPerRow,
      slidesToSlide: 1, // Asegura que solo se mueva una tarjeta
      partialVisibilityGutter: 0
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: Math.min(2, itemsPerRow),
      slidesToSlide: 1,
      partialVisibilityGutter: 0
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
      partialVisibilityGutter: 0
    }
  };

  // Agrupar recetas por categoría
  const getRecipesByCategories = (categories) => {
    return recipes
      .filter(recipe => categories.includes(recipe.category))
      .sort((a, b) => a.title.localeCompare(b.title)); // Ordenar alfabéticamente
  };

  // Renderizar una tarjeta de receta
  const RecipeCard = ({ recipe }) => (
    <div className="recipe-card">
      {recipe.image_path && (
        <div className="recipe-image">
          <img src={recipe.image_path} alt={recipe.title} />
        </div>
      )}
      <div className="recipe-card-content">
        <h3>{recipe.title}</h3>
        <p className="recipe-description">{recipe.description}</p>
        
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="recipe-card-tags">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="recipe-card-tag">
                {tag}
              </span>
            ))}
            {recipe.tags.length > 3 && (
              <span className="recipe-card-tag-more">
                +{recipe.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="recipe-meta">
          <span>🕒 {recipe.cooking_time} minutos</span>
          <span>👥 {recipe.servings} personas</span>
        </div>
        
        <div className="recipe-actions">
          <Link 
            to={`/recipes/${recipe.id}`}
            className="btn btn-view"
            onClick={() => console.log('Navegando a receta:', recipe)}
          >
            Ver
          </Link>
          
          {isAuthenticated && (
            <>
              <Link 
                to={`/recipes/${recipe.id}/edit`}
                className="btn btn-edit"
              >
                Editar
              </Link>
              <button 
                onClick={() => handleDelete(recipe.id)}
                className="btn btn-delete"
              >
                Eliminar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    console.log('RecipeList component mounted');
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axiosInstance.get('/recipes/');
      console.log('Recetas cargadas:', response.data); // Debug log
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
        await axiosInstance.delete(`/recipes/${id}`);
        setRecipes(recipes.filter(recipe => recipe.id !== id));
        toast.success('Receta eliminada correctamente');
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
    <div className="recipe-list" ref={containerRef}>
      <h2 className="recipe-list-title">Lista de recetas</h2>

      {CATEGORIES_ORDER.map((categoryGroup, index) => {
        const categoryRecipes = getRecipesByCategories(categoryGroup);
        if (categoryRecipes.length === 0) return null;

        return (
          <div key={index} className="category-section">
            <h3 className="category-title">
              {categoryGroup.join(' y ')}
            </h3>
            <div className="carousel-wrapper">
              <Carousel
                responsive={responsive}
                infinite={categoryRecipes.length > itemsPerRow}
                className="recipe-carousel"
                itemClass="carousel-item-wrapper"
                containerClass="carousel-container"
                arrows={categoryRecipes.length > itemsPerRow}
                renderButtonGroupOutside={true}
                partialVisible={false}
                centerMode={false}
                swipeable={true}
                draggable={false} // Deshabilitar arrastre para evitar reordenamientos extraños
                minimumTouchDrag={80}
                shouldResetAutoplay={false}
                rewind={false} // Evitar que el carrusel "rebote"
                rewindWithAnimation={false}
              >
                {categoryRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </Carousel>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecipeList;