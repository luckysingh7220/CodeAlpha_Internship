import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import ProtectedRoute from './components/ProtectedRoute';
import CreatePostModal from './components/CreatePostModal';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import PostDetailPage from './pages/PostDetailPage';
import Footer from './components/Footer';
import './App.css';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [showCreatePost, setShowCreatePost] = useState(false);

  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const showLayout = isAuthenticated && !isAuthPage;

  const handlePostCreated = () => {
    window.location.reload();
  };

  return (
    <>
      {!isAuthPage && (
        <Navbar onCreatePost={() => setShowCreatePost(true)} />
      )}

      {showLayout && <Sidebar />}

      <div className={showLayout ? 'app-layout' : ''}>
        <div className={showLayout ? 'main-content' : ''}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <FeedPage onCreatePost={() => setShowCreatePost(true)} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/explore"
              element={
                <ProtectedRoute>
                  <ExplorePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post/:id"
              element={
                <ProtectedRoute>
                  <PostDetailPage />
                </ProtectedRoute>
              }
            />
          </Routes>
          {showLayout && <Footer />}
        </div>
      </div>

      {showLayout && (
        <MobileNav onCreatePost={() => setShowCreatePost(true)} />
      )}

      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
