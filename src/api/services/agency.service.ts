import { BaseService } from './base.service';
import { API_ENDPOINTS } from '../config';
import { CreateAgencyDto } from '../../types/agency';

// Agency Statistics Interface
export interface AgencyStatistics {
  totalStaff: number;
  totalCustomers: number;
  activeTransactions: number;
  monthlyGrowth: number;
  recentActivity: Array<{
    id: number;
    type: string;
    content: string;
    timestamp: string;
  }>;
}

// Agency Staff Interface
export interface AgencyStaff {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin?: Date;
  department?: string;
  permissions?: string[];
}

// Customer Interface
export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: 'active' | 'pending' | 'inactive';
  createdAt: string;
  lastTransaction?: string;
}

// Agency Interface
export interface Agency {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  bankId: string;
  bankName?: string;
  status: 'active' | 'inactive';
  staffCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

class AgencyService extends BaseService {
  // Super Admin Agency Management
  async getAllAgencies(): Promise<Agency[]> {
    return this.get<Agency[]>(`${API_ENDPOINTS.SUPER_ADMIN.AGENCIES}`);
  }

  async createAgency(bankId: string, data: CreateAgencyDto): Promise<Agency> {
    return this.post<Agency>(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/agencies`, data);
  }

  async getAgencies(bankId: string): Promise<Agency[]> {
    return this.get<Agency[]>(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/agencies`);
  }

  async updateAgency(bankId: string, agencyId: string, data: Partial<Agency>): Promise<Agency> {
    return this.put<Agency>(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/agencies/${agencyId}`, data);
  }

  async deleteAgency(bankId: string, agencyId: string): Promise<void> {
    return this.delete(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/agencies/${agencyId}`);
  }

  // Super Admin Agency Staff Management
  async createAgencyStaff(bankId: string, agencyId: string, data: Partial<AgencyStaff>): Promise<AgencyStaff> {
    return this.post<AgencyStaff>(
      `${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/agencies/${agencyId}/staff`,
      data
    );
  }

  async getAgencyStaff(bankId: string, agencyId: string): Promise<AgencyStaff[]> {
    return this.get<AgencyStaff[]>(
      `${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/agencies/${agencyId}/staff`
    );
  }

  async updateAgencyStaff(bankId: string, agencyId: string, staffId: string, data: Partial<AgencyStaff>): Promise<AgencyStaff> {
    return this.put<AgencyStaff>(
      `${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/agencies/${agencyId}/staff/${staffId}`,
      data
    );
  }

  async deleteAgencyStaff(bankId: string, agencyId: string, staffId: string): Promise<void> {
    return this.delete(
      `${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/agencies/${agencyId}/staff/${staffId}`
    );
  }

  async updateAgencyStaffRoles(bankId: string, agencyId: string, staffId: string, roles: string[]): Promise<AgencyStaff> {
    return this.put<AgencyStaff>(
      `${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/agencies/${agencyId}/staff/${staffId}/roles`,
      { roles }
    );
  }

  // Agency Admin Statistics
  async getStatistics(): Promise<AgencyStatistics> {
    return this.get<AgencyStatistics>(API_ENDPOINTS.AGENCY.STATISTICS);
  }

  // Agency Admin Staff Management
  async getStaff(): Promise<AgencyStaff[]> {
    return this.get<AgencyStaff[]>(API_ENDPOINTS.AGENCY.STAFF);
  }

  async createStaff(data: Partial<AgencyStaff>): Promise<AgencyStaff> {
    return this.post<AgencyStaff>(API_ENDPOINTS.AGENCY.STAFF, data);
  }

  async updateStaff(id: string, data: Partial<AgencyStaff>): Promise<AgencyStaff> {
    return this.put<AgencyStaff>(`${API_ENDPOINTS.AGENCY.STAFF}/${id}`, data);
  }

  async deleteStaff(id: string): Promise<void> {
    return this.delete(`${API_ENDPOINTS.AGENCY.STAFF}/${id}`);
  }

  // Agency Admin Customer Management
  async getCustomers(): Promise<Customer[]> {
    return this.get<Customer[]>(API_ENDPOINTS.AGENCY.CUSTOMERS);
  }

  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    return this.post<Customer>(API_ENDPOINTS.AGENCY.CUSTOMERS, data);
  }

  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    return this.put<Customer>(`${API_ENDPOINTS.AGENCY.CUSTOMERS}/${id}`, data);
  }

  async deleteCustomer(id: string): Promise<void> {
    return this.delete(`${API_ENDPOINTS.AGENCY.CUSTOMERS}/${id}`);
  }

  // Agency Settings
  async updateSettings(data: any): Promise<void> {
    return this.put(API_ENDPOINTS.AGENCY.SETTINGS, data);
  }

  async getSettings(): Promise<any> {
    return this.get(API_ENDPOINTS.AGENCY.SETTINGS);
  }

  // Helper method to determine if using mock data
  protected getMockData(): any {
    return {
      statistics: {
        totalStaff: 15,
        totalCustomers: 150,
        activeTransactions: 25,
        monthlyGrowth: 12,
        recentActivity: [
          {
            id: 1,
            type: 'staff_added',
            content: 'New staff member added',
            timestamp: '2 hours ago'
          },
          {
            id: 2,
            type: 'customer_added',
            content: 'New customer onboarded',
            timestamp: '3 hours ago'
          }
        ]
      },
      staff: [],
      customers: []
    };
  }
}

export const agencyService = new AgencyService();