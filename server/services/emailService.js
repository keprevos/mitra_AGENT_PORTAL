import nodemailer from 'nodemailer';
import { EMAIL_CONFIG } from '../config/email.config.js';

const transporter = nodemailer.createTransport({
  host: EMAIL_CONFIG.SMTP_HOST,
  port: EMAIL_CONFIG.SMTP_PORT,
  secure: EMAIL_CONFIG.SMTP_SECURE,
  auth: {
    user: EMAIL_CONFIG.SMTP_USER,
    pass: EMAIL_CONFIG.SMTP_PASS,
  },
});

export const emailService = {
  async sendWelcomeEmail(user, temporaryPassword) {
    const mailOptions = {
      from: EMAIL_CONFIG.FROM_ADDRESS,
      to: user.email,
      subject: 'Welcome to Mitra Agent Portal',
      html: `
        <h1>Welcome to Mitra Agent Portal</h1>
        <p>Dear ${user.firstName} ${user.lastName},</p>
        <p>Your account has been created. Please use the following credentials to log in:</p>
        <p>Email: ${user.email}</p>
        <p>Temporary Password: ${temporaryPassword}</p>
        <p>For security reasons, you will be required to change your password upon first login.</p>
        <p>Best regards,<br>Mitra Agent Portal Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  },

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${EMAIL_CONFIG.APP_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: EMAIL_CONFIG.FROM_ADDRESS,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset Request</h1>
        <p>Dear ${user.firstName} ${user.lastName},</p>
        <p>You have requested to reset your password. Please click the link below to proceed:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not request this reset, please ignore this email.</p>
        <p>Best regards,<br>Mitra Agent Portal Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  },

  async sendPasswordChangeNotification(user) {
    const mailOptions = {
      from: EMAIL_CONFIG.FROM_ADDRESS,
      to: user.email,
      subject: 'Password Changed Successfully',
      html: `
        <h1>Password Changed Successfully</h1>
        <p>Dear ${user.firstName} ${user.lastName},</p>
        <p>Your password has been successfully changed.</p>
        <p>If you did not make this change, please contact support immediately.</p>
        <p>Best regards,<br>Mitra Agent Portal Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  },
};