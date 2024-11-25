import { BaseService } from './base.service';
import { EndUserRequest } from '../../types/auth';
import { mockRequests } from '../mock/mockData';
import { APP_CONFIG } from '../../config/app.config';
import { API_ENDPOINTS } from '../config';
import { RequestStatus } from '../../types/onboarding';

export interface RequestStatusUpdate {
  status: number; // Changed to number since we're sending the enum value
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
    // Send the numeric enum value directly
    const statusValue = typeof update.status === 'string' 
      ? RequestStatus[update.status as keyof typeof RequestStatus]
      : update.status;

    return this.put<EndUserRequest>(`/onboarding/requests/${id}/status`, {
      ...update,
      status: statusValue
    });
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

  getDocumentUrl(path: string): string {
    if (path.startsWith('http')) return path;
    return `${APP_CONFIG.API_BASE_URL}${path}`;
  }
}

export const requestService = new RequestService();