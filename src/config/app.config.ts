export const APP_CONFIG = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  USE_MOCK_DATA: false,

  // Feature Flags
  FEATURES: {
    TWO_FACTOR_AUTH: false,
    DOCUMENT_UPLOAD: true,
    ADVANCED_VALIDATION: true,
  },

  // Request Status Types
  REQUEST_STATUS: {
    ANALYSIS: 'analyse',
    CLIENT_RESPONSE: 'client-response',
    CTO_REVIEW: 'cto-review',
    DOUBLE_VALIDATION: 'double-validation',
    CAPITAL_ALLOCATION: 'capital',
    INITIAL_TRANSFER: 'initial-transfer',
    KBIS_PENDING: 'kbis',
    ACCOUNTS_OPENED: 'opened',
    REJECTED: 'rejected',
    IN_PROGRESS: 'in-progress'
  } as const,
};