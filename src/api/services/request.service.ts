import { BaseService } from './base.service';
import { EndUserRequest } from '../../types/auth';
import { mockRequests } from '../mock/mockData';
import { APP_CONFIG } from '../../config/app.config';
import { API_ENDPOINTS } from '../config';

export const { REQUEST_STATUS } = APP_CONFIG;
export type RequestStatus = typeof REQUEST_STATUS[keyof typeof REQUEST_STATUS];

export interface RequestStatusUpdate {
  status: RequestStatus;
  comment?: string;
  fieldUpdates?: Record<string, any>;
}

export interface RequestComment {
  fieldId?: string;
  status: 'ok' | 'error' | 'warning';
  message: string;
}

class RequestService extends BaseService {
  protected getMockData() {
    return mockRequests;
  }

  async getRequests(): Promise<EndUserRequest[]> {
    return this.get<EndUserRequest[]>('/onboarding/requests');
  }

  async getRequestById(id: string): Promise<EndUserRequest> {
    return this.get<EndUserRequest>(`/onboarding/requests/${id}`);
  }

  async updateRequestStatus(id: string, update: RequestStatusUpdate): Promise<EndUserRequest> {
    return this.put<EndUserRequest>(`/onboarding/requests/${id}/status`, update);
  }

  async addComment(id: string, comment: RequestComment): Promise<EndUserRequest> {
    return this.post<EndUserRequest>(`/onboarding/requests/${id}/comments`, comment);
  }

  async updateField(id: string, fieldId: string, value: any): Promise<EndUserRequest> {
    return this.put<EndUserRequest>(`/onboarding/requests/${id}/fields/${fieldId}`, { value });
  }

  async createRequest(data: Partial<EndUserRequest>): Promise<EndUserRequest> {
    return this.post<EndUserRequest>(API_ENDPOINTS.ONBOARDING.REQUESTS, data);
  }


  async updateRequest(id: string, data: any): Promise<EndUserRequest> {
    // Format the data to match the backend expectations
    const updateData = {
      personalInfo: data.data?.personal,
      businessInfo: data.data?.business,
      shareholders: data.data?.shareholders,
      documents: data.data?.documents
    };

    return this.put<EndUserRequest>(`${API_ENDPOINTS.ONBOARDING.REQUESTS}/${id}`, updateData);
  }

  async uploadDocument(requestId: string, type: string, file: File): Promise<{ url: string }> {
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

  // Helper method to get full document URL
  getDocumentUrl(path: string): string {
    if (path.startsWith('http')) return path;
    return `${APP_CONFIG.API_BASE_URL}${path}`;
  }

}

export const requestService = new RequestService();