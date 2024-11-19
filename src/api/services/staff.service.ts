import { BaseService } from './base.service';
import { API_ENDPOINTS } from '../config';
import { Staff, StaffRequest } from '../../types/staff';

class StaffService extends BaseService {
  // Staff Management
  async getStaff(bankId: string): Promise<Staff[]> {
    return this.get(`${API_ENDPOINTS.BANK.STAFF}?bankId=${bankId}`);
  }

  async createStaff(data: Partial<Staff>): Promise<Staff> {
    return this.post(API_ENDPOINTS.BANK.STAFF, data);
  }

  async updateStaff(id: string, data: Partial<Staff>): Promise<Staff> {
    return this.put(`${API_ENDPOINTS.BANK.STAFF}/${id}`, data);
  }

  async updateStaffRole(id: string, role: string, permissions: string[]): Promise<Staff> {
    return this.put(`${API_ENDPOINTS.BANK.STAFF}/${id}/role`, { role, permissions });
  }

  // Staff Requests
  async createStaffRequest(data: Partial<StaffRequest>): Promise<StaffRequest> {
    return this.post(`${API_ENDPOINTS.BANK.STAFF}/requests`, data);
  }

  async getStaffRequests(bankId: string): Promise<StaffRequest[]> {
    return this.get(`${API_ENDPOINTS.BANK.STAFF}/requests?bankId=${bankId}`);
  }

  async approveStaffRequest(requestId: string): Promise<void> {
    return this.put(`${API_ENDPOINTS.BANK.STAFF}/requests/${requestId}/approve`, {});
  }

  async rejectStaffRequest(requestId: string, reason: string): Promise<void> {
    return this.put(`${API_ENDPOINTS.BANK.STAFF}/requests/${requestId}/reject`, { reason });
  }

  // Agent Management
  async createAgentRequest(data: Partial<StaffRequest>): Promise<StaffRequest> {
    return this.post(`${API_ENDPOINTS.BANK.AGENTS}/requests`, data);
  }

  async getAgentRequests(bankId: string): Promise<StaffRequest[]> {
    return this.get(`${API_ENDPOINTS.BANK.AGENTS}/requests?bankId=${bankId}`);
  }

  async getAgents(bankId: string): Promise<Staff[]> {
    return this.get(`${API_ENDPOINTS.BANK.AGENTS}?bankId=${bankId}`);
  }
}

export const staffService = new StaffService();