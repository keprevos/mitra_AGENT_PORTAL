import { BaseService } from './base.service';
import { API_ENDPOINTS } from '../config';
import { 
  OnboardingRequest, 
  PersonalInfo, 
  BusinessInfo, 
  Shareholder, 
  Documents,
  RequestStatus
} from '../../types/onboarding';

class OnboardingService extends BaseService {
  async createRequest(data: {
    personalInfo?: PersonalInfo;
    businessInfo?: BusinessInfo;
    shareholders?: Shareholder[];
    documents?: Documents;
  }): Promise<OnboardingRequest> {
    return this.post<OnboardingRequest>(API_ENDPOINTS.ONBOARDING.REQUESTS, data);
  }

  async updateRequest(id: string, data: Partial<OnboardingRequest>): Promise<OnboardingRequest> {
    return this.put<OnboardingRequest>(`${API_ENDPOINTS.ONBOARDING.REQUESTS}/${id}`, data);
  }

  async getRequest(id: string): Promise<OnboardingRequest> {
    return this.get<OnboardingRequest>(`${API_ENDPOINTS.ONBOARDING.REQUESTS}/${id}`);
  }

  async submitForReview(id: string): Promise<OnboardingRequest> {
    return this.post<OnboardingRequest>(
      `${API_ENDPOINTS.ONBOARDING.REQUESTS}/${id}/submit`,
      {}
    );
  }

  async uploadDocument(
    requestId: string,
    type: keyof Documents,
    file: File
  ): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.post<{ url: string }>(
      `${API_ENDPOINTS.ONBOARDING.REQUESTS}/${requestId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
  }

  async validateRequest(
    id: string,
    validations: Record<string, { 
      status: 'valid' | 'invalid' | 'warning';
      comment?: string;
    }>
  ): Promise<OnboardingRequest> {
    return this.post<OnboardingRequest>(
      `${API_ENDPOINTS.ONBOARDING.REQUESTS}/${id}/validate`,
      { validations }
    );
  }

  async getRequestHistory(id: string): Promise<OnboardingRequest['history']> {
    return this.get<OnboardingRequest['history']>(
      `${API_ENDPOINTS.ONBOARDING.REQUESTS}/${id}/history`
    );
  }
}

export const onboardingService = new OnboardingService();