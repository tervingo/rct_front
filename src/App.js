import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <AuthProvider>
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
              <Route path="/cookies" element={<CookiePolicy />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer />
          <CookieBanner />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;