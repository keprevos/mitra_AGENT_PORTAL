import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/userModel.js';
import { auditService } from '../services/auditService.js';
import { emailService } from '../services/emailService.js';
import { passwordService } from '../services/passwordService.js';
import { AUTH_CONFIG } from '../config/auth.config.js';

export const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const ipAddress = req.ip;
      
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check for too many failed login attempts
      const recentFailedAttempts = await userModel.getRecentFailedAttempts(
        user.id,
        AUTH_CONFIG.LOGIN_LOCKOUT_DURATION
      );

      if (recentFailedAttempts >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS) {
        return res.status(401).json({
          message: 'Account temporarily locked. Please try again later.'
        });
      }

      const isValidPassword = await passwordService.verifyPassword(
        password,
        user.password
      );

      if (!isValidPassword) {
        await auditService.logLoginAttempt(user.id, false, ipAddress);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check if password reset is required
      if (user.status === 'pending_password_reset') {
        return res.status(200).json({
          requiresPasswordChange: true,
          temporaryToken: jwt.sign(
            { id: user.id },
            AUTH_CONFIG.JWT_SECRET,
            { expiresIn: '1h' }
          ),
        });
      }

      // Check if password has expired
      const passwordExpired = await passwordService.isPasswordExpired(
        user.password_updated_at
      );
      
      if (passwordExpired) {
        await userModel.updateStatus(user.id, 'pending_password_reset');
        return res.status(200).json({
          requiresPasswordChange: true,
          temporaryToken: jwt.sign(
            { id: user.id },
            AUTH_CONFIG.JWT_SECRET,
            { expiresIn: '1h' }
          ),
        });
      }

      await userModel.updateLastLogin(user.id);
      await auditService.logLoginAttempt(user.id, true, ipAddress);

      const token = jwt.sign(
        { id: user.id, role: user.role },
        AUTH_CONFIG.JWT_SECRET,
        { expiresIn: AUTH_CONFIG.JWT_EXPIRATION }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        AUTH_CONFIG.REFRESH_TOKEN_SECRET,
        { expiresIn: AUTH_CONFIG.REFRESH_TOKEN_EXPIRATION }
      );

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          bankId: user.bank_id,
          agencyId: user.agency_id,
        },
        token,
        refreshToken,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;
      const ipAddress = req.ip;

      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verify current password
      const isValidPassword = await passwordService.verifyPassword(
        currentPassword,
        user.password
      );

      if (!isValidPassword) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // Validate new password strength
      const { isValid, errors } = passwordService.validatePasswordStrength(newPassword);
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid password', errors });
      }

      // Update password and status
      const hashedPassword = await passwordService.hashPassword(newPassword);
      await userModel.updatePassword(userId, hashedPassword);
      await userModel.updateStatus(userId, 'active');

      // Log password change
      await auditService.logPasswordReset(userId, 'user_initiated', ipAddress);
      await emailService.sendPasswordChangeNotification(user);

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Password change error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      
      const decoded = jwt.verify(refreshToken, AUTH_CONFIG.REFRESH_TOKEN_SECRET);
      const user = await userModel.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        AUTH_CONFIG.JWT_SECRET,
        { expiresIn: AUTH_CONFIG.JWT_EXPIRATION }
      );

      res.json({ token });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({ message: 'Invalid token' });
    }
  },

  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;
      const ipAddress = req.ip;

      const user = await userModel.findByEmail(email);
      if (!user) {
        // Return success even if user not found to prevent email enumeration
        return res.json({ message: 'If the email exists, reset instructions will be sent' });
      }

      const resetToken = uuidv4();
      const resetExpires = new Date(Date.now() + AUTH_CONFIG.PASSWORD_RESET_EXPIRATION);

      await userModel.setPasswordResetToken(user.id, resetToken, resetExpires);
      await emailService.sendPasswordResetEmail(user, resetToken);
      await auditService.logPasswordReset(user.id, 'forgot_password', ipAddress);

      res.json({ message: 'If the email exists, reset instructions will be sent' });
    } catch (error) {
      console.error('Password reset request error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      const ipAddress = req.ip;

      const user = await userModel.findByResetToken(token);
      if (!user || new Date() > new Date(user.password_reset_expires)) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      const { isValid, errors } = passwordService.validatePasswordStrength(newPassword);
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid password', errors });
      }

      const hashedPassword = await passwordService.hashPassword(newPassword);
      await userModel.updatePassword(user.id, hashedPassword);
      await userModel.clearPasswordResetToken(user.id);
      await userModel.updateStatus(user.id, 'active');

      await auditService.logPasswordReset(user.id, 'reset_completed', ipAddress);
      await emailService.sendPasswordChangeNotification(user);

      res.json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};