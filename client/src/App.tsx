import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProjectProvider } from './context/ProjectContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { ProjectDetail } from './pages/ProjectDetails';
import SentimentDashboard from './pages/SentimentDashboard';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import DeveloperDashboard from './pages/DeveloperDashboard';

// Components
import { PrivateRoute } from './components/PrivateRoute';

import './index.css';

// Component to handle role-based dashboard routing
const RoleBasedDashboard = () => {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    return <Dashboard />;
  } else if (user?.role === 'developer') {
    return <DeveloperDashboard />;
  }
  
  // Default fallback to unauthorized if role is not recognized
  return <Navigate to="/unauthorized" />;
};

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <RoleBasedDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/project/:id" 
                element={
                  <PrivateRoute>
                    <ProjectDetail />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/sentiment/:projectId" 
                element={
                  <PrivateRoute>
                    <SentimentDashboard />
                  </PrivateRoute>
                } 
              />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;
