import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Permission {
  name: string;
  description: string;
}

interface RoleContextType {
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: [
    'system.manage_banks',
    'system.manage_roles',
    'system.view_audit_logs',
    'bank.manage_agents',
    'bank.manage_staff',
    'bank.view_reports',
    'agency.manage_customers',
    'agency.process_transactions',
    'agency.view_reports',
  ],
  bank_admin: [
    'bank.manage_agents',
    'bank.manage_staff',
    'bank.view_reports',
    'agency.manage_customers',
    'agency.process_transactions',
    'agency.view_reports',
  ],
  agent: [
    'agency.manage_customers',
    'agency.process_transactions',
    'agency.view_reports',
  ],
  agent_staff: [
    'agency.manage_customers',
    'agency.process_transactions',
  ],
};

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    return rolePermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(hasPermission);
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(hasPermission);
  };

  return (
    <RoleContext.Provider value={{ hasPermission, hasAnyPermission, hasAllPermissions }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}