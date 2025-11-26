import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Učitavanje...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user doesn't have the required role, redirect based on their role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard
    if (user.role === 'STUDENT') {
      return <Navigate to="/student/dashboard" replace />;
    } else if (user.role === 'COMPANY') {
      return <Navigate to="/company/dashboard" replace />;
    } else if (user.role === 'FACULTY') {
      return <Navigate to="/faculty/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // User is authenticated and has the right role
  return children;
}

