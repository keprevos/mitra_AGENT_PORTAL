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
import { APP_CONFIG } from '../../config/app.config';

class OnboardingService extends BaseService {
  async createRequest(data: {
    personalInfo?: PersonalInfo;
    businessInfo?: BusinessInfo;
    shareholders?: Shareholder[];
    documents?: Documents;
  }): Promise<OnboardingRequest> {
    return this.post<OnboardingRequest>(`${API_ENDPOINTS.ONBOARDING.REQUESTS}`, data);
  }

  async updateRequest(id: string, data: Partial<OnboardingRequest>): Promise<OnboardingRequest> {
    return this.put<OnboardingRequest>(`${API_ENDPOINTS.ONBOARDING.REQUESTS}/${id}`, data);
  }

  async getRequest(id: string): Promise<OnboardingRequest> {
    return this.get<OnboardingRequest>(`${API_ENDPOINTS.ONBOARDING.REQUESTS}/${id}`);
  }

  async getRequests(): Promise<OnboardingRequest[]> {
    return this.get<OnboardingRequest[]>(`${API_ENDPOINTS.ONBOARDING.REQUESTS}`);
  }

  async submitForReview(id: string): Promise<OnboardingRequest> {
    return this.post<OnboardingRequest>(
      `${API_ENDPOINTS.ONBOARDING.REQUESTS}/${id}/submit`,
      {}
    );
  }

  async uploadDocument(
    requestId: string,
    type: string,
    file: File
  ): Promise<{ 
    url: string;
    originalName: string;
    mimeType: string;
    size: number;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/onboarding/requests/${requestId}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  }

  async getRequestHistory(id: string): Promise<OnboardingRequest['history']> {
    return this.get<OnboardingRequest['history']>(
      `${API_ENDPOINTS.ONBOARDING.REQUESTS}/${id}/history`
    );
  }
}

export const onboardingService = new OnboardingService();