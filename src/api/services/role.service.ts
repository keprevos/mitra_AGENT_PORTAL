import { BaseService } from './base.service';
import { API_ENDPOINTS } from '../config';

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface Role {
  id: string;
  name: string;
  group: string;
  description: string;
  permissions: Permission[];
}

class RoleService extends BaseService {
  async getRoles(): Promise<Role[]> {
    return this.get<Role[]>(`${API_ENDPOINTS.SUPER_ADMIN.ROLES}`);
  }

  async getPermissions(): Promise<Permission[]> {
    return this.get<Permission[]>(`${API_ENDPOINTS.SUPER_ADMIN.ROLES}/permissions`);
  }

  async createRole(data: Partial<Role>): Promise<Role> {
    return this.post<Role>(`${API_ENDPOINTS.SUPER_ADMIN.ROLES}`, data);
  }

  async updateRole(id: string, data: Partial<Role>): Promise<Role> {
    return this.put<Role>(`${API_ENDPOINTS.SUPER_ADMIN.ROLES}/${id}`, data);
  }

  async deleteRole(id: string): Promise<void> {
    return this.delete(`${API_ENDPOINTS.SUPER_ADMIN.ROLES}/${id}`);
  }

  async assignPermissions(roleId: string, permissions: string[]): Promise<Role> {
    return this.put<Role>(`${API_ENDPOINTS.SUPER_ADMIN.ROLES}/${roleId}/permissions`, { permissions });
  }
}

export const roleService = new RoleService();