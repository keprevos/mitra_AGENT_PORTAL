import axiosInstance from '../axios';
import { API_ENDPOINTS } from '../config';
import { Bank } from '../../types/auth';
import { mockStatistics, mockBanks } from '../mock/mockData';

export interface CreateBankDto {
  name: string;
  registrationNumber: string;
  address: string;
  adminEmail: string;
  adminFirstName: string;
  adminLastName: string;
}

export interface UpdateBankDto {
  name?: string;
  registrationNumber?: string;
  address?: string;
  status?: 'active' | 'inactive';
}

export interface SuperAdminStatistics {
  totalBanks: number;
  totalAgents: number;
  totalRequests: number;
  activeRequests: number;
  recentActivity: Array<{
    id: number;
    type: string;
    content: string;
    timestamp: string;
    bankName?: string;
  }>;
  bankDistribution: Array<{
    bankId: string;
    bankName: string;
    agentCount: number;
    requestCount: number;
  }>;
}

export const superAdminService = {
  async getStatistics(): Promise<SuperAdminStatistics> {
    // Use mock data instead of API call
    return Promise.resolve(mockStatistics);
  },

  async getBanks(): Promise<Bank[]> {
    // Use mock data instead of API call
    return Promise.resolve(mockBanks);
  },

  async createBank(data: CreateBankDto): Promise<Bank> {
    // Simulate API call with mock data
    const newBank: Bank = {
      id: `bank${mockBanks.length + 1}`,
      name: data.name,
      registrationNumber: data.registrationNumber,
      address: data.address,
      status: 'active',
      totalAgents: 0,
      totalRequests: 0,
      createdAt: new Date(),
      lastModified: new Date()
    };
    return Promise.resolve(newBank);
  },

  async updateBank(id: string, data: UpdateBankDto): Promise<Bank> {
    // Simulate API call with mock data
    const bank = mockBanks.find(b => b.id === id);
    if (!bank) {
      throw new Error('Bank not found');
    }
    return Promise.resolve({
      ...bank,
      ...data,
      lastModified: new Date()
    });
  },

  async deleteBank(id: string): Promise<void> {
    // Simulate API call
    return Promise.resolve();
  },
};