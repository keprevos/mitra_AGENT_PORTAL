export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    RESET_PASSWORD: '/auth/reset-password',
  },
  SUPER_ADMIN: {
    BANKS: '/admin/banks',
    BANK_STAFF: '/admin/bank-staff',
    AGENTS: '/admin/agents',
    AGENT_STAFF: '/admin/agent-staff',
    STATISTICS: '/admin/statistics',
  },
  BANK: {
    STAFF: '/bank/staff',
    AGENTS: '/bank/agents',
    SETTINGS: '/bank/settings',
  },
  AGENT: {
    STAFF: '/agent/staff',
    CUSTOMERS: '/agent/customers',
    REQUESTS: '/agent/requests',
  },
};