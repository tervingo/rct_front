import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { BACKEND_URL, CATEGORIES } from '../constants';
import axiosInstance from '../utils/axios';

const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    comment: '',
    description: '',
    ingredients: '',
    instructions: '',
    cooking_time: '',
    servings: '',
    category: '',
    tags: '',
    image_path: ''
  });

  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/recipes/${id}`);
        const recipe = response.data;
        
        setFormData({
          title: recipe.title || '',
          comment: recipe.comment || '',
          description: recipe.description || '',
          ingredients: Array.isArray(recipe.ingredients) 
            ? recipe.ingredients.join('\n')
            : recipe.ingredients || '',
          instructions: Array.isArray(recipe.instructions)
            ? recipe.instructions.join('\n')
            : recipe.instructions || '',
          cooking_time: recipe.cooking_time || '',
          servings: recipe.servings || '',
          category: recipe.category || '',
          tags: Array.isArray(recipe.tags) 
            ? recipe.tags.join(', ')
            : recipe.tags || '',
          image_path: recipe.image_path || ''
        });
      } catch (error) {
        console.error('Error al cargar la receta:', error);
        toast.error('Error al cargar la receta');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipe();
  }, [id, navigate]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/tags/`);
        setAvailableTags(response.data);
        console.log('Etiquetas disponibles:', availableTags);
      } catch (error) {
        console.error('Error al cargar etiquetas:', error);
        toast.error('Error al cargar las etiquetas existentes');
      }
    };
    fetchTags();
  }, [availableTags]);

  const validateForm = () => {
    let isValid = true;

    if (!formData.title.trim()) {
      toast.error('El título es obligatorio');
      isValid = false;
    }

    if (!formData.description.trim()) {
      toast.error('La descripción es obligatoria');
      isValid = false;
    }

    if (!formData.ingredients.trim()) {
      toast.error('Se requiere al menos un ingrediente');
      isValid = false;
    }

    if (!formData.instructions.trim()) {
      toast.error('Se requiere al menos una instrucción');
      isValid = false;
    }

    if (!formData.cooking_time || formData.cooking_time <= 0) {
      toast.error('El tiempo de cocción debe ser mayor que 0');
      isValid = false;
    }

    if (!formData.servings || formData.servings <= 0) {
      toast.error('El número de porciones debe ser mayor que 0');
      isValid = false;
    }

    if (!formData.category) {
      toast.error('La categoría es obligatoria');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSaving(true);

    try {
      const dataToSend = {
        title: formData.title,
        comment: formData.comment,
        description: formData.description,
        ingredients: formData.ingredients
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0),
        instructions: formData.instructions
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0),
        cooking_time: parseInt(formData.cooking_time),
        servings: parseInt(formData.servings),
        category: formData.category,
        tags: formData.tags
          ? formData.tags.split(',')
              .map(tag => tag.trim())
              .filter(tag => tag.length > 0)
          : [],
        image_path: formData.image_path || null
      };

      if (id) {
        await axiosInstance.put(`/recipes/${id}`, dataToSend);
        toast.success('Receta actualizada correctamente');
      } else {
        await axiosInstance.post('/recipes', dataToSend);
        toast.success('Receta creada correctamente');
      }
      
      navigate('/');
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error(
        error.response?.data?.detail?.[0]?.msg || 
        'Error al guardar la receta'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if (window.confirm('¿Estás seguro de que quieres cancelar? Los datos no guardados se perderán.')) {
      navigate('/');
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>{id ? 'Editar Receta' : 'Nueva Receta'}</h2>
      
      <div className="form-group">
        <label htmlFor="title">Título:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={e => setFormData({...formData, title: e.target.value})}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="comment">Comentario:</label>
        <input
          type="text"
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={e => setFormData({...formData, comment: e.target.value})}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="ingredients">Ingredientes (uno por línea):</label>
        <textarea
          id="ingredients"
          name="ingredients"
          value={formData.ingredients}
          onChange={e => setFormData({...formData, ingredients: e.target.value})}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="instructions">Instrucciones (una por línea):</label>
        <textarea
          id="instructions"
          name="instructions"
          value={formData.instructions}
          onChange={e => setFormData({...formData, instructions: e.target.value})}
          required
          className="form-input"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="cooking_time">Tiempo de cocción (minutos):</label>
          <input
            type="number"
            id="cooking_time"
            name="cooking_time"
            value={formData.cooking_time}
            onChange={e => setFormData({...formData, cooking_time: e.target.value})}
            required
            min="1"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="servings">Número de personas:</label>
          <input
            type="number"
            id="servings"
            name="servings"
            value={formData.servings}
            onChange={e => setFormData({...formData, servings: e.target.value})}
            required
            min="1"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="category">Categoría:</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={e => setFormData({...formData, category: e.target.value})}
          required
          className="form-input"
        >
          <option value="">Selecciona una categoría</option>
          {CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="tags">Etiquetas (separadas por comas):</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={e => setFormData({...formData, tags: e.target.value})}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="image_path">URL de la imagen:</label>
        <input
          type="text"
          id="image_path"
          name="image_path"
          value={formData.image_path}
          onChange={(e) => setFormData({ ...formData, image_path: e.target.value })}
          className="form-input"
          placeholder="Ruta de la imagen (opcional)"
        />
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSaving}
        >
          {isSaving ? 'Guardando...' : (id ? 'Actualizar' : 'Crear')}
        </button>
        <button 
          type="button"
          onClick={handleCancel}
          className="btn btn-secondary"
          disabled={isSaving}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default RecipeForm;