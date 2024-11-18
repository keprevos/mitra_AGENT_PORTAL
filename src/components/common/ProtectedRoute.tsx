import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useRole } from '../../contexts/RoleContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiresAllPermissions?: boolean;
}

export function ProtectedRoute({
  children,
  requiredPermissions = [],
  requiresAllPermissions = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const { hasAnyPermission, hasAllPermissions } = useRole();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermissions.length > 0) {
    const hasPermissions = requiresAllPermissions
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasPermissions) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}