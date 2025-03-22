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
import Login from './components/Login';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import UserAdmin from './components/UserAdmin';

function App() {
  const handleSubmit = async (formData) => {
    try {
      // Show loading toast
      const loadingToast = toast.loading("Guardando receta...");
      
      const response = await axios.post('https://recetarium-back.onrender.com/recipes/', formData);
      
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
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<RecipeList />} />
              <Route path="/recipes/:id" element={<RecipeDetail />} />
              <Route 
                path="/new" 
                element={
                  <PrivateRoute>
                    <RecipeForm />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/recipes/:id/edit"
                element={
                  <PrivateRoute>
                    <RecipeForm />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <PrivateRoute>
                    <UserAdmin />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;