import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Login from './components/Login';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import UserAdmin from './components/UserAdmin';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import CookiePolicy from './components/CookiePolicy';
import { initGA, logPageView } from './utils/analytics';
import SideMenu from './components/SideMenu';

// Componente separado para el tracking de Analytics
function AppContent() {
  const location = useLocation();

  useEffect(() => {
    // Trackear cambios de página
    logPageView();
  }, [location]);

  return (
    <>
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
        <Route path="/cookies" element={<CookiePolicy />} />
      </Routes>
      <Footer />
      <CookieBanner />
    </>
  );
}

function App() {
  useEffect(() => {
    // Inicializar GA solo una vez
    initGA();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <div className="app-container">
            <SideMenu />
            <main className="main-content-with-sidebar">
              <AppContent />
            </main>
          </div>
          <ToastContainer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;