import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from './contexts/AuthContext';

// Import pages
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Import dashboard pages
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import AddPropertyPage from './pages/dashboard/AddPropertyPage';
import EditPropertyPage from './pages/dashboard/EditPropertyPage';
import MyPropertiesPage from './pages/dashboard/MyPropertiesPage';
import InquiriesPage from './pages/dashboard/InquiriesPage';
import SavedPropertiesPage from './pages/dashboard/SavedPropertiesPage';

// Import components
import Header from './components/layout/Header';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Helmet>
        <title>PakProperty - Pakistan's Leading Property Rental Platform</title>
        <meta name="description" content="Find your perfect rental property in Pakistan. Browse apartments, houses, and commercial properties in major cities like Karachi, Lahore, and Islamabad." />
        <meta name="keywords" content="property rental, Pakistan, Karachi, Lahore, Islamabad, real estate, apartments, houses, commercial property" />
        <link rel="canonical" href="https://pakproperty.com" />
      </Helmet>

      <Header />
      
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="/add-property" element={
            <ProtectedRoute allowedRoles={['owner', 'agent']}>
              <AddPropertyPage />
            </ProtectedRoute>
          } />
          
          <Route path="/edit-property/:id" element={
            <ProtectedRoute allowedRoles={['owner', 'agent']}>
              <EditPropertyPage />
            </ProtectedRoute>
          } />
          
          <Route path="/my-properties" element={
            <ProtectedRoute allowedRoles={['owner', 'agent']}>
              <MyPropertiesPage />
            </ProtectedRoute>
          } />
          
          <Route path="/inquiries" element={
            <ProtectedRoute>
              <InquiriesPage />
            </ProtectedRoute>
          } />
          
          <Route path="/saved-properties" element={
            <ProtectedRoute>
              <SavedPropertiesPage />
            </ProtectedRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 