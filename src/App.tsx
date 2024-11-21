import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RoleProvider } from './contexts/RoleContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { BankDashboard } from './pages/BankDashboard';
import { AgencyDashboard } from './pages/AgencyDashboard';
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
    case 'agency_admin':
      return <AgencyDashboard />;
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
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
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