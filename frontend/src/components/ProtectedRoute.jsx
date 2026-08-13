import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Show loading indicator while session is restoring from localStorage
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
        <span className="text-sm text-slate-400 font-semibold">Restoring session...</span>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if route is adminOnly but user is a normal user
  if (adminOnly && !isAdmin) {
    return <Navigate to="/products" replace />;
  }

  return children;
}
