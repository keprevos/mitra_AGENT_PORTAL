import { z } from 'zod';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'bank_admin' | 'agent';
  bankId?: string;
  agencyId?: string;
  lastLogin?: Date;
}

export interface Bank {
  id: string;
  name: string;
  registrationNumber: string;
  address: string;
  status: 'active' | 'inactive';
  totalAgents: number;
  totalRequests: number;
  createdAt: Date;
  lastModified: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Agent {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  agencyId: string;
  agencyName: string;
  bankId: string;
  bankName: string;
  status: 'active' | 'inactive';
  lastLogin?: Date;
  createdAt: Date;
  totalRequests: number;
  pendingRequests: number;
}

export interface EndUserRequest {
  id: number;
  agentId: string;
  agentName: string;
  agencyName: string;
  bankId: string;
  bankName: string;
  name: string;
  email: string;
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Information Required';
  submissionDate: string;
  type: string;
  companyName?: string;
  lastModified: string;
  data?: any;
  comments?: Array<{
    id: number;
    userId: string;
    userName: string;
    role: 'agent' | 'bank_admin' | 'super_admin';
    message: string;
    timestamp: string;
  }>;
}