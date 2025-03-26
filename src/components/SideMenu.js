import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const SideMenu = () => {
  const [categories, setCategories] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axiosInstance.get('/recipes/');
      // Organizar las recetas por categoría
      const categorized = response.data.reduce((acc, recipe) => {
        const category = recipe.category || 'Sin categoría';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(recipe);
        return acc;
      }, {});

      // Ordenar las recetas dentro de cada categoría
      Object.keys(categorized).forEach(category => {
        categorized[category].sort((a, b) => 
          a.title.localeCompare(b.title, 'es', { sensitivity: 'base' })
        );
      });

      setCategories(categorized);
      
      // Inicializar todas las categorías como expandidas
      const initialExpandedState = Object.keys(categorized).reduce((acc, category) => {
        acc[category] = true;
        return acc;
      }, {});
      setExpandedCategories(initialExpandedState);
    } catch (error) {
      console.error('Error al cargar las recetas:', error);
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleRecipeClick = (recipeId) => {
    console.log('ID de receta:', recipeId);
    if (!recipeId) {
      console.error('ID de receta no válido');
      return;
    }
    navigate(`/recipes/${recipeId}`);
  };

  return (
    <div className="side-menu">
      <nav className="category-nav">
        {Object.entries(categories).map(([category, recipes]) => (
          <div key={category} className="category-section">
            <button 
              className={`category-header ${expandedCategories[category] ? 'expanded' : ''}`}
              onClick={() => toggleCategory(category)}
            >
              <span>{category}</span>
              <span className="expand-icon">
                {expandedCategories[category] ? '▼' : '▶'}
              </span>
            </button>
            {expandedCategories[category] && (
              <ul className="recipe-list">
                {recipes.map(recipe => (
                  <li key={recipe._id}>
                    <button 
                      className="recipe-link"
                      onClick={() => handleRecipeClick(recipe._id || recipe.id)}
                    >
                      {recipe.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default SideMenu;
