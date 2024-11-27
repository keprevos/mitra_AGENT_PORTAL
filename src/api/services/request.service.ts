import { BaseService } from './base.service';
import { EndUserRequest } from '../../types/auth';
import { mockRequests } from '../mock/mockData';
import { APP_CONFIG } from '../../config/app.config';
import { API_ENDPOINTS } from '../config';
import { RequestStatus,ValidationFeedback } from '../../types/onboarding';
export interface RequestStatusUpdate {
  status: number;
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

  // async getRequests(status?: RequestStatus): Promise<EndUserRequest[]> {
  //   const endpoint = status !== undefined 
  //     ? `${API_ENDPOINTS.ONBOARDING.REQUESTS}?status=${status}`
  //     : API_ENDPOINTS.ONBOARDING.REQUESTS;
    
  //   return this.get<EndUserRequest[]>(endpoint);
  // }

  // async getRequestById(id: string): Promise<EndUserRequest> {
  //   return this.get<EndUserRequest>(`${API_ENDPOINTS.ONBOARDING.REQUESTS}/${id}`);
  // }

  // async updateRequestStatus(id: string, update: RequestStatusUpdate): Promise<EndUserRequest> {
  //   return this.put<EndUserRequest>(`${API_ENDPOINTS.ONBOARDING.REQUESTS}/${id}/status`, update);
  // }

  async addComment(id: string, comment: RequestComment): Promise<EndUserRequest> {
    return this.post<EndUserRequest>(`${API_ENDPOINTS.ONBOARDING.REQUESTS}/${id}/comments`, comment);
  }

  // async updateField(id: string, fieldId: string, value: any): Promise<EndUserRequest> {
  //   return this.put<EndUserRequest>(`${API_ENDPOINTS.ONBOARDING.REQUESTS}/${id}/fields/${fieldId}`, { value });
  // }

  // async createRequest(data: Partial<EndUserRequest>): Promise<EndUserRequest> {
  //   return this.post<EndUserRequest>(API_ENDPOINTS.ONBOARDING.REQUESTS, data);
  // }

  // async updateRequest(id: string, data: any): Promise<EndUserRequest> {
  //   const updateData = {
  //     personalInfo: data.data?.personal,
  //     businessInfo: data.data?.business,
  //     shareholders: data.data?.shareholders,
  //     documents: data.data?.documents
  //   };

  //   return this.put<EndUserRequest>(`${API_ENDPOINTS.ONBOARDING.REQUESTS}/${id}`, updateData);
  // }

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
  // async getValidationFeedback(requestId: string): Promise<ValidationFeedback[]> {
  //   return this.get<ValidationFeedback[]>(
  //     `${API_ENDPOINTS.ONBOARDING.REQUESTS}/${requestId}/validation`
  //   );
  // }

  async getRequests(status?: RequestStatus): Promise<EndUserRequest[]> {
    const endpoint = status !== undefined 
      ? `${API_ENDPOINTS.ONBOARDING.REQUESTS}?status=${status}`
      : API_ENDPOINTS.ONBOARDING.REQUESTS;
    
    return this.get<EndUserRequest[]>(endpoint);
  }

  async getRequestById(id: string): Promise<EndUserRequest> {
    return this.get<EndUserRequest>(`${API_ENDPOINTS.ONBOARDING.REQUESTS}/${id}`);
  }

  async updateRequestStatus(id: string, update: RequestStatusUpdate): Promise<EndUserRequest> {
    return this.put<EndUserRequest>(`${API_ENDPOINTS.ONBOARDING.REQUESTS}/${id}/status`, update);
  }

  async updateField(id: string, fieldId: string, value: any): Promise<EndUserRequest> {
    return this.put<EndUserRequest>(`${API_ENDPOINTS.ONBOARDING.REQUESTS}/${id}/fields/${fieldId}`, { value });
  }

  async getValidationFeedback(id: string): Promise<ValidationFeedback[]> {
    alert(id);
    // if (!id) {
    //   throw new Error('Request ID is required');
    // }
    return this.get<ValidationFeedback[]>(`${API_ENDPOINTS.ONBOARDING.REQUESTS}/${id}/validation`);
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
}

export const requestService = new RequestService();