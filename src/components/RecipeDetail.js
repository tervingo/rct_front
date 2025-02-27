import { Link } from 'react-router-dom';

function RecipeDetail() {
    return (
      <div className="recipe-detail">
        <h2>Título de la Receta</h2>
        <div className="recipe-meta">
          <span>30 minutos</span>
          <span>4 porciones</span>
          <span>Categoría</span>
        </div>
        
        <section className="recipe-section">
          <h3>Ingredientes</h3>
          <ul className="ingredients-list">
            <li>Ingrediente 1</li>
            <li>Ingrediente 2</li>
          </ul>
        </section>
  
        <section className="recipe-section">
          <h3>Instrucciones</h3>
          <ol className="instructions-list">
            <li>Paso 1</li>
            <li>Paso 2</li>
          </ol>
        </section>
  
        <div className="recipe-actions">
          <Link to="/recipe/1/edit" className="btn btn-primary">Editar</Link>
          <button className="btn btn-danger">Eliminar</button>
        </div>
      </div>
    );
  }
  
export default RecipeDetail;