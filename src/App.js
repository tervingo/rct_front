import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import EditRecipeForm from './components/EditRecipeForm';

function App() {
  const handleSubmit = async (formData) => {
    try {
      // Show loading toast
      const loadingToast = toast.loading("Guardando receta...");
      
      const response = await axios.post('http://localhost:8000/recipes/', formData);
      
      // Update loading toast to success
      toast.update(loadingToast, {
        render: "¡Receta guardada correctamente!",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });

      console.log('Receta creada:', response.data);
      
      // Redirect to home page after successful save
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch (error) {
      // Show error toast
      toast.error(
        error.response?.data?.detail || 
        'Error al guardar la receta. Por favor, inténtalo de nuevo.'
      );
      
      console.error('Detalles del error:', error.response?.data);
    }
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-brand">
            Cuchara de palo
            <img 
              src="/images/cuchara.png" 
              alt="Cuchara" 
              className="navbar-logo"
            />
            </div>

          <div className="navbar-links">
            <Link to="/">Inicio</Link>
            <Link to="/new">Nueva receta</Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/new" element={<RecipeForm onSubmit={handleSubmit} />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/recipe/:id/edit" element={<EditRecipeForm />} />
          </Routes>
        </main>

        {/* Toast Container for notifications */}
        <ToastContainer 
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;