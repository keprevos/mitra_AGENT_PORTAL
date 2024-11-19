import { BaseService } from './base.service';
import { API_ENDPOINTS } from '../config';
import { CreateBankDto, Bank } from '../../types/bank';
import { Staff, StaffRequest } from '../../types/staff';

class AdminService extends BaseService {
  // Bank Management
  async createBank(data: CreateBankDto): Promise<Bank> {
    return this.post(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}`, data);
  }

  async getBanks(): Promise<Bank[]> {
    return this.get(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}`);
  }

  // Staff Management
  async createBankStaff(data: any): Promise<Staff> {
    return this.post(`${API_ENDPOINTS.SUPER_ADMIN.BANK_STAFF}`, data);
  }

  async getBankStaff(bankId: string): Promise<Staff[]> {
    return this.get(`${API_ENDPOINTS.SUPER_ADMIN.BANK_STAFF}?bankId=${bankId}`);
  }

  async updateStaffRoles(staffId: string, roles: string[]): Promise<Staff> {
    return this.put(`${API_ENDPOINTS.SUPER_ADMIN.BANK_STAFF}/${staffId}/roles`, { roles });
  }

  // Staff Request Management
  async createStaffRequest(data: any): Promise<StaffRequest> {
    return this.post(`${API_ENDPOINTS.SUPER_ADMIN.BANK_STAFF}/requests`, data);
  }

  async getStaffRequests(bankId: string): Promise<StaffRequest[]> {
    return this.get(`${API_ENDPOINTS.SUPER_ADMIN.BANK_STAFF}/requests?bankId=${bankId}`);
  }

  async approveStaffRequest(requestId: string): Promise<void> {
    return this.put(`${API_ENDPOINTS.SUPER_ADMIN.BANK_STAFF}/requests/${requestId}/approve`, {});
  }

  async rejectStaffRequest(requestId: string, reason: string): Promise<void> {
    return this.put(`${API_ENDPOINTS.SUPER_ADMIN.BANK_STAFF}/requests/${requestId}/reject`, { reason });
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