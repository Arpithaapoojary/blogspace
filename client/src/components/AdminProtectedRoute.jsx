import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * AdminProtectedRoute — Only allows users with role === 'admin'.
 * Redirects to '/' with a 403-style message if not admin.
 */
export default function AdminProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '60vh' }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return (
      <main className="page-wrapper center-content">
        <div style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🚫</div>
          <h1 style={{ fontWeight: 800, fontSize: '2rem', marginBottom: '0.75rem' }}>Access Denied</h1>
          <p style={{ color: 'var(--fg-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
            You don't have permission to view this page. This area is restricted to administrators only.
          </p>
          <Navigate to="/" replace />
        </div>
      </main>
    );
  }

  return children;
}
