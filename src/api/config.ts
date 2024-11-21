export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    VALIDATE_TOKEN: '/auth/validate-token',
    RESET_PASSWORD: '/auth/reset-password',
  },
  SUPER_ADMIN: {
    BANKS: '/admin/banks',
    BANK_STAFF: '/admin/bank-staff',
    AGENCIES: '/admin/agencies',
    AGENCY_STAFF: '/admin/agency-staff',
    STATISTICS: '/admin/statistics',
    ROLES: '/admin/roles',

  },
  BANK: {
    STAFF: '/bank/staff',
    AGENCIES: '/bank/agencies',
    SETTINGS: '/bank/settings',
  },
  AGENCY: {
    STAFF: '/agency/staff',
    CUSTOMERS: '/agency/customers',
    REQUESTS: '/agency/requests',
  },
};