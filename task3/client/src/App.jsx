import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import BoardPage from './pages/BoardPage';
import { LayoutDashboard, LogOut } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;
  return children;
};

const Navbar = () => {
  const { user, logout } = React.useContext(AuthContext);
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <LayoutDashboard size={24} color="var(--accent-primary)" />
        TaskFlow
      </div>
      {user && (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>Welcome, {user.username}</span>
          <button className="btn btn-secondary" onClick={logout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

const AppContent = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/board/:projectId" 
          element={
            <ProtectedRoute>
              <BoardPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
