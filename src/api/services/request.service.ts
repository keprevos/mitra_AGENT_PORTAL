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
    return this.get<EndUserRequest[]>('/requests');
  }

  async getRequestById(id: number): Promise<EndUserRequest> {
    if (APP_CONFIG.USE_MOCK_DATA) {
      const request = mockRequests.find(r => r.id === id);
      if (!request) {
        throw new Error('Request not found');
      }
      return Promise.resolve(request);
    }

    return this.get<EndUserRequest>(`/requests/${id}`);
  }

  async updateRequestStatus(id: number, update: RequestStatusUpdate): Promise<EndUserRequest> {
    if (APP_CONFIG.USE_MOCK_DATA) {
      const request = mockRequests.find(r => r.id === id);
      if (!request) {
        throw new Error('Request not found');
      }
      return Promise.resolve({
        ...request,
        status: update.status,
        lastModified: new Date().toISOString()
      });
    }

    return this.put<EndUserRequest>(`/requests/${id}/status`, update);
  }

  async addComment(id: number, comment: RequestComment): Promise<EndUserRequest> {
    if (APP_CONFIG.USE_MOCK_DATA) {
      const request = mockRequests.find(r => r.id === id);
      if (!request) {
        throw new Error('Request not found');
      }
      return Promise.resolve({
        ...request,
        comments: [
          ...(request.comments || []),
          {
            id: Date.now(),
            userId: 'mock-user',
            userName: 'Mock User',
            role: 'bank_admin',
            message: comment.message,
            timestamp: new Date().toISOString()
          }
        ]
      });
    }

    return this.post<EndUserRequest>(`/requests/${id}/comments`, comment);
  }

  async updateField(id: number, fieldId: string, value: any): Promise<EndUserRequest> {
    if (APP_CONFIG.USE_MOCK_DATA) {
      const request = mockRequests.find(r => r.id === id);
      if (!request) {
        throw new Error('Request not found');
      }
      return Promise.resolve({
        ...request,
        data: {
          ...request.data,
          [fieldId]: value
        },
        lastModified: new Date().toISOString()
      });
    }

    return this.put<EndUserRequest>(`/requests/${id}/fields/${fieldId}`, { value });
  }
}

export const requestService = new RequestService();