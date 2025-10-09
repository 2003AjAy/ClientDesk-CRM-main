import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProjectProvider } from './context/ProjectContext';
import { AuthProvider } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { ProjectDetail } from './pages/ProjectDetails';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';

// Components
import { PrivateRoute } from './components/PrivateRoute';

import './index.css';

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
                    <Dashboard />
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
