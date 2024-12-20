export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    VALIDATE_TOKEN: '/auth/validate-token'
  },
  ONBOARDING: {
    REQUESTS: '/onboarding/requests',
    DOCUMENTS: '/onboarding/documents',
    VALIDATIONS: '/onboarding/validations'
  },
  SUPER_ADMIN: {
    BANKS: '/admin/banks',
    BANK_STAFF: '/admin/bank-staff',
    AGENCIES: '/admin/agencies',
    AGENT_STAFF: '/admin/agent-staff',
    STATISTICS: '/admin/statistics',
    ROLES: '/roles'
  },
  BANK: {
    STAFF: '/bank/staff',
    AGENTS: '/bank/agents',
    SETTINGS: '/bank/settings'
  },
  AGENCY: {
    STAFF: '/agencies/staff',
    CUSTOMERS: '/agencies/customers',
    TRANSACTIONS: '/agencies/transactions',
    STATISTICS: '/agencies/statistics'
  }
};