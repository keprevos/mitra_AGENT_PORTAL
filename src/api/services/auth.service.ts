import axiosInstance from '../axios';
import { API_ENDPOINTS } from '../config';
import { User } from '../../types/auth';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
  message: string;
}

export interface TokenValidationResponse {
  user: User;
  valid: boolean;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Login failed. Please try again.');
    }
  },

  async validateToken(): Promise<TokenValidationResponse> {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.VALIDATE_TOKEN);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      localStorage.clear();
    }
  },

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });
    return response.data;
  },
};