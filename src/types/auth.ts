export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'agent' | 'admin';
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}