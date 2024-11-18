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
  refreshToken: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    localStorage.clear();
  },

  async resetPassword(email: string): Promise<void> {
    await axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { email });
  },
};