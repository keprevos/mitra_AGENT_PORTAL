import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Mock login logic
    if (email === 'admin@example.com' && password === 'password') {
      // Super admin login
      const user: User = {
        id: '1',
        email: 'admin@example.com',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'super_admin',
        lastLogin: new Date(),
      };
      setUser(user);
    } else if (email === 'bank@example.com' && password === 'password') {
      // Bank admin login
      const user: User = {
        id: '2',
        email: 'bank@example.com',
        firstName: 'Bank',
        lastName: 'Admin',
        role: 'bank_admin',
        bankId: 'bank1',
        lastLogin: new Date(),
      };
      setUser(user);
    } else if (email === 'demo@example.com' && password === 'password') {
      // Agent login
      const user: User = {
        id: '3',
        email: 'demo@example.com',
        firstName: 'Demo',
        lastName: 'Agent',
        role: 'agent',
        agencyId: 'agency1',
        bankId: 'bank1',
        lastLogin: new Date(),
      };
      setUser(user);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}