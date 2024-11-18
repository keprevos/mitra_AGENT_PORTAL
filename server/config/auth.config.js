export const AUTH_CONFIG = {
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRATION: '1d',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret',
  REFRESH_TOKEN_EXPIRATION: '7d',

  // Password Reset
  PASSWORD_RESET_EXPIRATION: 24 * 60 * 60 * 1000, // 24 hours
  
  // Password Policy
  PASSWORD_POLICY: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
    SPECIAL_CHARS: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    MAX_AGE_DAYS: 90, // Force password change after 90 days
  },

  // Login Security
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCKOUT_DURATION: 30 * 60 * 1000, // 30 minutes

  // Session
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
};