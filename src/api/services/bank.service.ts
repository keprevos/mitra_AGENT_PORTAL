import { BaseService } from './base.service';
import { mockBankStatistics } from '../mock/mockData';

export interface BankSettings {
  name: string;
  registrationNumber: string;
  address: string;
  securitySettings: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
  };
  notificationSettings: {
    newRequests: boolean;
    agentActivity: boolean;
  };
}

export interface BankStatistics {
  totalAgents: number;
  activeRequests: number;
  approvedToday: number;
  pendingReview: number;
  recentActivity: Array<{
    id: number;
    type: string;
    content: string;
    timestamp: string;
  }>;
}

class BankService extends BaseService {
  protected getMockData() {
    return mockBankStatistics;
  }

  async getSettings(): Promise<BankSettings> {
    return this.get<BankSettings>('/bank/settings');
  }

  async updateSettings(settings: Partial<BankSettings>): Promise<BankSettings> {
    return this.put<BankSettings>('/bank/settings', settings);
  }

  async getStatistics(): Promise<BankStatistics> {
    try {
      return await this.get<BankStatistics>('/bank/statistics');
    } catch (error) {
      console.warn('Failed to fetch statistics from API, using mock data');
      return mockBankStatistics;
    }
  }
}

export const bankService = new BankService();