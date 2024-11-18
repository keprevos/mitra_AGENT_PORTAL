export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    RESET_PASSWORD: '/auth/reset-password',
  },
  SUPER_ADMIN: {
    STATISTICS: '/super-admin/statistics',
    BANKS: '/super-admin/banks',
    UPDATE_BANK: '/super-admin/banks/:id',
    DELETE_BANK: '/super-admin/banks/:id',
    GLOBAL_AGENTS: '/super-admin/agents',
    GLOBAL_REQUESTS: '/super-admin/requests',
    SETTINGS: '/super-admin/settings',
  },
  AGENTS: {
    BASE: '/agents',
    LIST: '/agents',
    CREATE: '/agents',
    UPDATE: '/agents/:id',
    DELETE: '/agents/:id',
    TOGGLE_STATUS: '/agents/:id/status',
  },
  END_USERS: {
    BASE: '/end-users',
    LIST: '/end-users',
    CREATE: '/end-users',
    UPDATE: '/end-users/:id',
    GET_BY_ID: '/end-users/:id',
    SUBMIT_REQUEST: '/end-users/requests',
  },
  REQUESTS: {
    BASE: '/requests',
    LIST: '/requests',
    GET_BY_ID: '/requests/:id',
    UPDATE_STATUS: '/requests/:id/status',
    ADD_COMMENT: '/requests/:id/comments',
    UPLOAD_DOCUMENT: '/requests/:id/documents',
  },
  BANK: {
    SETTINGS: '/bank/settings',
    UPDATE_SETTINGS: '/bank/settings',
    STATISTICS: '/bank/statistics',
  },
};