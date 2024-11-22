import { BaseService } from './base.service';
import { API_ENDPOINTS } from '../config';

export interface ValidationRule {
  id: string;
  field: string;
  type: 'required' | 'format' | 'range' | 'custom';
  params?: Record<string, any>;
  message: string;
  severity: 'error' | 'warning';
  category: 'personal' | 'business' | 'documents';
}

export interface ValidationResult {
  field: string;
  valid: boolean;
  message?: string;
  severity: 'error' | 'warning';
}

class ValidationService extends BaseService {
  async getValidationRules(): Promise<ValidationRule[]> {
    return this.get<ValidationRule[]>('/validation/rules');
  }

  async validateField(
    requestId: string,
    field: string,
    value: any
  ): Promise<ValidationResult> {
    return this.post<ValidationResult>('/validation/field', {
      requestId,
      field,
      value
    });
  }

  async validateRequest(
    requestId: string
  ): Promise<Record<string, ValidationResult>> {
    return this.post<Record<string, ValidationResult>>(
      '/validation/request',
      { requestId }
    );
  }

  async saveValidationResult(
    requestId: string,
    field: string,
    result: ValidationResult
  ): Promise<void> {
    await this.post('/validation/results', {
      requestId,
      field,
      result
    });
  }

  async getValidationHistory(
    requestId: string
  ): Promise<Array<{
    field: string;
    timestamp: Date;
    validator: string;
    result: ValidationResult;
  }>> {
    return this.get(`/validation/history/${requestId}`);
  }
}

export const validationService = new ValidationService();