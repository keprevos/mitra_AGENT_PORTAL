import React from 'react';
import { useRole } from '../../contexts/RoleContext';

interface PermissionGateProps {
  children: React.ReactNode;
  permissions: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export function PermissionGate({
  children,
  permissions,
  requireAll = false,
  fallback = null,
}: PermissionGateProps) {
  const { hasAnyPermission, hasAllPermissions } = useRole();

  const hasPermissions = requireAll
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);

  return hasPermissions ? <>{children}</> : <>{fallback}</>;
}