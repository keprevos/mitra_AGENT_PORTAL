import { Agent } from '../../types/auth';
import { BaseService } from './base.service';
import { mockAgents } from '../mock/mockData';
import { APP_CONFIG } from '../../config/app.config';

export interface CreateAgentDto {
  email: string;
  firstName: string;
  lastName: string;
  agencyId: string;
  bankId: string;
}

export interface UpdateAgentDto {
  firstName?: string;
  lastName?: string;
  agencyId?: string;
  status?: 'active' | 'inactive';
}

class AgentService extends BaseService {
  protected getMockData() {
    return mockAgents;
  }

  async getAgents(): Promise<Agent[]> {
    return this.get<Agent[]>('/agents');
  }

  async createAgent(data: CreateAgentDto): Promise<Agent> {
    if (APP_CONFIG.USE_MOCK_DATA) {
      // Create mock agent with generated ID
      const newAgent: Agent = {
        id: `agent${mockAgents.length + 1}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        agencyId: data.agencyId,
        agencyName: 'New Agency',
        bankId: data.bankId,
        bankName: 'Mock Bank',
        status: 'active',
        createdAt: new Date(),
        totalRequests: 0,
        pendingRequests: 0
      };
      return Promise.resolve(newAgent);
    }

    return this.post<Agent>('/agents', data);
  }

  async updateAgent(id: string, data: UpdateAgentDto): Promise<Agent> {
    if (APP_CONFIG.USE_MOCK_DATA) {
      const agent = mockAgents.find(a => a.id === id);
      if (!agent) {
        throw new Error('Agent not found');
      }
      return Promise.resolve({
        ...agent,
        ...data,
      });
    }

    return this.put<Agent>(`/agents/${id}`, data);
  }

  async deleteAgent(id: string): Promise<void> {
    return this.delete(`/agents/${id}`);
  }

  async toggleAgentStatus(id: string): Promise<Agent> {
    if (APP_CONFIG.USE_MOCK_DATA) {
      const agent = mockAgents.find(a => a.id === id);
      if (!agent) {
        throw new Error('Agent not found');
      }
      return Promise.resolve({
        ...agent,
        status: agent.status === 'active' ? 'inactive' : 'active'
      });
    }

    return this.put<Agent>(`/agents/${id}/status`, {});
  }
}

export const agentService = new AgentService();