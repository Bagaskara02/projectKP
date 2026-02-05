import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import InputDetail from './pages/InputDetail';
import Settings from './pages/Settings';
import ActivityLog from './pages/ActivityLog';
import Login from './pages/Login';

// Protected Route wrapper - redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4e73df]"></div>
      </div>
    );
  }
  
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Main App Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Login Page - No Layout */}
      <Route path="/login" element={<Login />} />
      
      {/* Pages with Layout */}
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
      <Route path="/input/:id" element={<Layout><InputDetail /></Layout>} />
      <Route path="/settings" element={<Layout><Settings /></Layout>} />
      
      {/* Protected Routes - Require Login */}
      <Route 
        path="/activity-log" 
        element={
          <ProtectedRoute>
            <Layout><ActivityLog /></Layout>
          </ProtectedRoute>
        } 
      />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;