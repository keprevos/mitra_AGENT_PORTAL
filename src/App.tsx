import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RoleProvider } from './contexts/RoleContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { BankDashboard } from './pages/BankDashboard';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { Unauthorized } from './pages/Unauthorized';
import { useAuth } from './contexts/AuthContext';

function DashboardRouter() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'super_admin':
      return <SuperAdminDashboard />;
    case 'bank_admin':
      return <BankDashboard />;
    case 'agent':
    case 'agent_staff':
      return <Dashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Super Admin Routes */}
            <Route
              path="/super-admin/*"
              element={
                <ProtectedRoute
                  requiredPermissions={['system.manage_banks']}
                >
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Bank Admin Routes */}
            <Route
              path="/bank-admin/*"
              element={
                <ProtectedRoute
                  requiredPermissions={['bank.manage_agents', 'bank.manage_staff']}
                  requiresAllPermissions={false}
                >
                  <BankDashboard />
                </ProtectedRoute>
              }
            />

            {/* Agent Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  requiredPermissions={['agency.manage_customers']}
                >
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </RoleProvider>
    </AuthProvider>
  );
}