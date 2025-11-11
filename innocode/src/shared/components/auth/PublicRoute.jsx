import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

/**
 * PublicRoute - For pages that should only be accessible when NOT authenticated
 * Examples: Login, Register
 * If user is already logged in, redirect to home
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Wait for auth check to complete
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f3f3f3]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b35]"></div>
          <p className="mt-4 text-[#7A7574]">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If not authenticated, show the public page (Login, Register, etc.)
  return children;
};

export default PublicRoute;
