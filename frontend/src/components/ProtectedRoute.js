import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Higher-Order Component to protect routes.
 * Redirects to /login if not authenticated.
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the location the user was trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * Redirects authenticated users away from Auth pages (Login/Register)
 */
export const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};