import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BACKEND_URL, CATEGORIES } from '../constants';


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
    category: '',
    comment: '',
    image_path: '',
    tags: []
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  const fetchRecipe = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/recipes/${id}`);
      setFormData(response.data);
      if (response.data.image_path) {
        setImagePreview(response.data.image_path);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar la receta:', error);
      toast.error('Error al cargar la receta');
      navigate('/');
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/tags/`);
        setAvailableTags(response.data);
      } catch (error) {
        console.error('Error al cargar etiquetas:', error);
      }
    };
    fetchTags();
  }, []);

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecciona un archivo de imagen válido');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${BACKEND_URL}/upload-image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData(prev => ({
        ...prev,
        image_path: response.data.image_path
      }));

      toast.success('Imagen actualizada correctamente');
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      toast.error('Error al subir la imagen');
    }
  };

  const handleRemoveImage = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar la imagen?')) {
      setImagePreview(null);
      setFormData(prev => ({
        ...prev,
        image_path: ''
      }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      if (!availableTags.includes(newTag.trim())) {
        setAvailableTags([...availableTags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if (window.confirm('¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.')) {
      navigate('/');
    }
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
        <label>Comentario:</label>
        <textarea
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          className="form-input"
          rows={4}
        />
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
        <label>Personas:</label>
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
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className={errors.category ? 'form-input error' : 'form-input'}
          required
        >
          {CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && <span className="error-message">{errors.category}</span>}
      </div>

      <div className="form-group">
        <label>Etiquetas:</label>
        <div className="tags-input-container">
          <div className="tags-list">
            {formData.tags && formData.tags.map(tag => (
              <span key={tag} className="tag">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="tag-remove"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="tag-input-wrapper">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="form-input"
              placeholder="Nueva etiqueta"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="btn btn-secondary"
            >
              Añadir
            </button>
          </div>
          {availableTags.length > 0 && (
            <div className="available-tags">
              <p>Etiquetas existentes:</p>
              <div className="tags-suggestions">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (!formData.tags.includes(tag)) {
                        setFormData({
                          ...formData,
                          tags: [...formData.tags, tag]
                        });
                      }
                    }}
                    className="tag-suggestion"
                    disabled={formData.tags.includes(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>Imagen de la receta:</label>
        <div className="image-upload-container">
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button 
                type="button" 
                onClick={handleRemoveImage}
                className="btn btn-danger btn-remove-image"
              >
                Eliminar imagen
              </button>
            </div>
          )}
          <div className="custom-file-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              id="file-upload"
              className="hidden-file-input"
            />
            <label htmlFor="file-upload" className="btn btn-secondary file-upload-btn">
              <i className="fas fa-camera"></i>
              {imagePreview ? 'Cambiar imagen' : 'Seleccionar imagen'}
            </label>
            <small className="image-help-text">
              {imagePreview 
                ? "Haz clic en el botón para seleccionar una nueva imagen" 
                : "Formato: JPG, PNG (Máx. 5MB)"}
            </small>
          </div>
        </div>
      </div>

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

export default EditRecipeForm; 