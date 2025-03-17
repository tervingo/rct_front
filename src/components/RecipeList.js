import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../constants';

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
        
        <div className="recipe-card-actions">
          <Link to={`/recipe/${recipe.id}`} className="btn btn-secondary">Ver</Link>
          <Link to={`/recipe/${recipe.id}/edit`} className="btn btn-primary">Editar</Link>
          <button onClick={() => handleDelete(recipe.id)} className="btn btn-danger">
            Eliminar
          </button>
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
    <div className="recipe-list" ref={containerRef}>
      <h2 className="recipe-list-title">Lista de recetas</h2>
      <Link to="/new" className="btn btn-primary add-recipe-btn">
        Añadir Nueva Receta
      </Link>

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