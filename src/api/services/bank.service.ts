import { BaseService } from './base.service';
import { Bank, CreateBankDto, UpdateBankDto } from '../../types/bank';
import { API_ENDPOINTS } from '../config';

class BankService extends BaseService {
  async getBanks(): Promise<Bank[]> {
    return this.get<Bank[]>(API_ENDPOINTS.SUPER_ADMIN.BANKS);
  }

  async createBank(data: CreateBankDto): Promise<Bank> {
    return this.post<Bank>(API_ENDPOINTS.SUPER_ADMIN.BANKS, data);
  }

  async updateBank(id: string, data: UpdateBankDto): Promise<Bank> {
    return this.put<Bank>(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${id}`, data);
  }

  async deleteBank(id: string): Promise<void> {
    return this.delete(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${id}`);
  }

  async getBankStaff(bankId: string): Promise<any[]> {
    return this.get(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/staff`);
  }

  async createBankStaff(bankId: string, data: any): Promise<any> {
    return this.post(`${API_ENDPOINTS.SUPER_ADMIN.BANKS}/${bankId}/staff`, data);
  }
}

export const bankService = new BankService();