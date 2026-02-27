import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AcceptInvite from './pages/AcceptInvite';
import ProjectDetail from './pages/ProjectDetail';
import Projects from './pages/Projects';
import Calendar from './pages/Calendar';
import Analytics from './pages/Analytics';
import Team from './pages/Team';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import './index.css';
import './layout.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useApp();
  if (loading) return <div className="app-loading"><span className="login-spinner" /></div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/accept-invite" element={<AcceptInvite />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/project/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
