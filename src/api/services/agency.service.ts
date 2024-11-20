import { BaseService } from './base.service';
import { API_ENDPOINTS } from '../config';
import { Agency, CreateAgencyDto } from '../../types/agency';
import { Staff } from '../../types/staff';

class AgencyService extends BaseService {
  // Agency Management
  async getAllAgencies(): Promise<Agency[]> {
    // This will fetch agencies from all banks
    const response = await this.get<Agency[]>(`${API_ENDPOINTS.SUPER_ADMIN.AGENCIES}`);
    return response;
  }

  async createAgency(bankId: string, data: CreateAgencyDto): Promise<Agency> {
    return this.post(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/agencies`, data);
  }

  async getAgencies(bankId: string): Promise<Agency[]> {
    return this.get(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/agencies`);
  }

  async updateAgency(bankId: string, agencyId: string, data: Partial<Agency>): Promise<Agency> {
    return this.put(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/agencies/${agencyId}`, data);
  }

  async deleteAgency(bankId: string, agencyId: string): Promise<void> {
    return this.delete(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/agencies/${agencyId}`);
  }

  // Agency Staff Management
  async createAgencyStaff(bankId: string, agencyId: string, data: Partial<Staff>): Promise<Staff> {
    return this.post(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/agencies/${agencyId}/staff`, data);
  }

  async getAgencyStaff(bankId: string, agencyId: string): Promise<Staff[]> {
    return this.get(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/agencies/${agencyId}/staff`);
  }

  async updateAgencyStaff(bankId: string, agencyId: string, staffId: string, data: Partial<Staff>): Promise<Staff> {
    return this.put(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/agencies/${agencyId}/staff/${staffId}`, data);
  }

  async deleteAgencyStaff(bankId: string, agencyId: string, staffId: string): Promise<void> {
    return this.delete(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/agencies/${agencyId}/staff/${staffId}`);
  }

  async updateAgencyStaffRoles(bankId: string, agencyId: string, staffId: string, roles: string[]): Promise<Staff> {
    return this.put(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/agencies/${agencyId}/staff/${staffId}/roles`, { roles });
  }
}

export const agencyService = new AgencyService();