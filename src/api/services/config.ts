export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    VALIDATE_TOKEN: '/auth/validate-token',
  },
  SUPER_ADMIN: {
    BANKS: '/admin/banks',
    BANK_STAFF: '/admin/bank-staff',
    AGENCIES: '/admin/agencies',
    AGENCY_STAFF: '/admin/agency-staff',
    STATISTICS: '/admin/statistics',
    ROLES: '/roles',
  },
  BANK: {
    STAFF: '/bank/staff',
    AGENTS: '/bank/agents',
    SETTINGS: '/bank/settings',
  },
  AGENCY: {
    STAFF: '/agency/staff',
    CUSTOMERS: '/agency/customers',
    TRANSACTIONS: '/agency/transactions',
    STATISTICS: '/agency/statistics',
  },
};