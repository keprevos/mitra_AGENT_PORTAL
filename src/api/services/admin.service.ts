import { BaseService } from './base.service';
import { API_ENDPOINTS } from '../config';
import { CreateBankDto, Bank } from '../../types/bank';
import { Staff, StaffRequest } from '../../types/staff';
import { mockBanks, mockStatistics } from '../mock/mockData';

class AdminService extends BaseService {

    // Bank Management
    async createBank(data: CreateBankDto): Promise<Bank> {
      return this.post(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}`, data);
    }
  
    async getBanks(): Promise<Bank[]> {
      return this.get(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}`);
    }
  
    async updateBank(id: string, data: Partial<Bank>): Promise<Bank> {
      return this.put(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${id}`, data);
    }
  
    async deleteBank(id: string): Promise<void> {
      return this.delete(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${id}`);
    }
  
    // Bank Staff Management
    async getBankStaff(bankId: string): Promise<Staff[]> {
      return this.get(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/staff`);
    }
  
    async createBankStaff(bankId: string, data: Partial<Staff>): Promise<Staff> {
      return this.post(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/staff`, data);
    }
  
    async updateBankStaff(bankId: string, staffId: string, data: Partial<Staff>): Promise<Staff> {
      return this.put(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/staff/${staffId}`, data);
    }
  
    async deleteBankStaff(bankId: string, staffId: string): Promise<void> {
      return this.delete(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/staff/${staffId}`);
    }
  
    async updateStaffRoles(bankId: string, staffId: string, roles: string[]): Promise<Staff> {
      return this.put(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/staff/${staffId}/roles`, { roles });
    }
  
    // Staff Request Management
    async createStaffRequest(data: Partial<StaffRequest>): Promise<StaffRequest> {
      return this.post(`${API_ENDPOINTS.SUPER_ADMIN.BANK_STAFF}/requests`, data);
    }
  
    async getStaffRequests(bankId: string): Promise<StaffRequest[]> {
      return this.get(`${API_ENDPOINTS.SUPER_ADMIN.BANK_STAFF}/requests?bankId=${bankId}`);
    }
  

  
    protected getMockData(): any {
      return mockBanks;
    }
  
  // Agent Management
  async createAgent(data: any): Promise<any> {
    return this.post(`${API_ENDPOINTS.SUPER_ADMIN.AGENTS}`, data);
  }

  async getAgents(): Promise<any[]> {
    return this.get(`${API_ENDPOINTS.SUPER_ADMIN.AGENTS}`);
  }

  // Agent Staff Management
  async createAgentStaff(data: any): Promise<Staff> {
    return this.post(`${API_ENDPOINTS.SUPER_ADMIN.AGENT_STAFF}`, data);
  }

  async getAgentStaff(agentId: string): Promise<Staff[]> {
    return this.get(`${API_ENDPOINTS.SUPER_ADMIN.AGENT_STAFF}?agentId=${agentId}`);
  }

  // Statistics
  async getStatistics(): Promise<any> {
    return this.get(`${API_ENDPOINTS.SUPER_ADMIN.STATISTICS}`);
  }
}

export const adminService = new AdminService();