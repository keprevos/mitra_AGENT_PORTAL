import { BaseService } from './base.service';
import { EndUserRequest } from '../../types/auth';
import { mockRequests } from '../mock/mockData';
import { APP_CONFIG } from '../../config/app.config';

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
}

export const requestService = new RequestService();