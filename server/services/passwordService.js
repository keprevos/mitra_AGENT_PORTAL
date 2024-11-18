import bcrypt from 'bcryptjs';
import generator from 'generate-password';
import { AUTH_CONFIG } from '../config/auth.config.js';

export const passwordService = {
  generateTemporaryPassword() {
    return generator.generate({
      length: 12,
      numbers: true,
      symbols: true,
      uppercase: true,
      lowercase: true,
      strict: true,
    });
  },

  validatePasswordStrength(password) {
    const { PASSWORD_POLICY } = AUTH_CONFIG;
    
    const errors = [];

    if (password.length < PASSWORD_POLICY.MIN_LENGTH) {
      errors.push(`Password must be at least ${PASSWORD_POLICY.MIN_LENGTH} characters long`);
    }

    if (PASSWORD_POLICY.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (PASSWORD_POLICY.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (PASSWORD_POLICY.REQUIRE_NUMBERS && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (PASSWORD_POLICY.REQUIRE_SPECIAL_CHARS && 
        !new RegExp(`[${PASSWORD_POLICY.SPECIAL_CHARS}]`).test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  },

  async isPasswordExpired(lastPasswordChange) {
    if (!lastPasswordChange) return true;

    const maxAge = AUTH_CONFIG.PASSWORD_POLICY.MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
    const passwordAge = Date.now() - new Date(lastPasswordChange).getTime();

    return passwordAge > maxAge;
  },
};