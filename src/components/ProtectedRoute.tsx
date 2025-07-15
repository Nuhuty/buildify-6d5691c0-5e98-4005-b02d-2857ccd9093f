
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiresVerification?: boolean;
}

const ProtectedRoute = ({ children, requiresVerification = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiresVerification && !user.nin_verified) {
    return <Navigate to="/verification/nin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;