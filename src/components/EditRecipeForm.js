import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const EditRecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    cooking_time: 0,
    servings: 1,
    category: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/recipes/${id}`);
      setFormData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar la receta:', error);
      toast.error('Error al cargar la receta');
      navigate('/');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }

    if (formData.ingredients.filter(i => i.trim()).length === 0) {
      newErrors.ingredients = 'Se requiere al menos un ingrediente';
    }

    if (formData.instructions.filter(i => i.trim()).length === 0) {
      newErrors.instructions = 'Se requiere al menos una instrucción';
    }

    if (formData.cooking_time <= 0) {
      newErrors.cooking_time = 'El tiempo de cocción debe ser mayor que 0';
    }

    if (formData.servings <= 0) {
      newErrors.servings = 'El número de porciones debe ser mayor que 0';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'La categoría es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, rellena todos los campos obligatorios correctamente');
      return;
    }

    try {
      const cleanedData = {
        ...formData,
        ingredients: formData.ingredients.filter(ing => ing.trim() !== ''),
        instructions: formData.instructions.filter(inst => inst.trim() !== ''),
        cooking_time: parseInt(formData.cooking_time),
        servings: parseInt(formData.servings)
      };

      await axios.put(`${BACKEND_URL}/recipes/${id}`, cleanedData);
      toast.success('Receta actualizada correctamente');
      navigate('/');
    } catch (error) {
      console.error('Error al actualizar la receta:', error);
      toast.error('Error al actualizar la receta');
    }
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData({ ...formData, instructions: newInstructions });
  };

  if (loading) {
    return <div className="loading">Cargando receta...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Editar Receta</h2>
      
      <div className="form-group">
        <label>Título:</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={errors.title ? 'form-input error' : 'form-input'}
          required
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>
      
      <div className="form-group">
        <label>Descripción:</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={errors.description ? 'form-input error' : 'form-input'}
          required
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label>Ingredientes:</label>
        {formData.ingredients.map((ingredient, index) => (
          <div key={index} className="input-with-button">
            <input
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              className={errors.ingredients ? 'form-input error' : 'form-input'}
              required
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => {
                  const newIngredients = formData.ingredients.filter((_, i) => i !== index);
                  setFormData({ ...formData, ingredients: newIngredients });
                }}
                className="btn btn-danger btn-small"
              >
                ×
              </button>
            )}
          </div>
        ))}
        {errors.ingredients && <span className="error-message">{errors.ingredients}</span>}
        <button 
          type="button" 
          onClick={() => setFormData({
            ...formData,
            ingredients: [...formData.ingredients, '']
          })}
          className="btn btn-secondary"
        >
          Añadir Ingrediente
        </button>
      </div>

      <div className="form-group">
        <label>Instrucciones:</label>
        {formData.instructions.map((instruction, index) => (
          <div key={index} className="input-with-button">
            <textarea
              value={instruction}
              onChange={(e) => handleInstructionChange(index, e.target.value)}
              className={errors.instructions ? 'form-input error' : 'form-input'}
              required
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => {
                  const newInstructions = formData.instructions.filter((_, i) => i !== index);
                  setFormData({ ...formData, instructions: newInstructions });
                }}
                className="btn btn-danger btn-small"
              >
                ×
              </button>
            )}
          </div>
        ))}
        {errors.instructions && <span className="error-message">{errors.instructions}</span>}
        <button 
          type="button" 
          onClick={() => setFormData({
            ...formData,
            instructions: [...formData.instructions, '']
          })}
          className="btn btn-secondary"
        >
          Añadir Instrucción
        </button>
      </div>

      <div className="form-group">
        <label>Tiempo de Cocción (minutos):</label>
        <input
          type="number"
          value={formData.cooking_time}
          onChange={(e) => setFormData({ ...formData, cooking_time: parseInt(e.target.value) || 0 })}
          className={errors.cooking_time ? 'form-input error' : 'form-input'}
          required
        />
        {errors.cooking_time && <span className="error-message">{errors.cooking_time}</span>}
      </div>

      <div className="form-group">
        <label>Porciones:</label>
        <input
          type="number"
          value={formData.servings}
          onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) || 1 })}
          className={errors.servings ? 'form-input error' : 'form-input'}
          required
        />
        {errors.servings && <span className="error-message">{errors.servings}</span>}
      </div>

      <div className="form-group">
        <label>Categoría:</label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className={errors.category ? 'form-input error' : 'form-input'}
          required
        />
        {errors.category && <span className="error-message">{errors.category}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
        <button 
          type="button" 
          onClick={() => navigate('/')} 
          className="btn btn-secondary"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditRecipeForm; 