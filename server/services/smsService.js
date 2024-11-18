import twilio from 'twilio';
import { SMS_CONFIG } from '../config/sms.config.js';

const client = twilio(SMS_CONFIG.accountSid, SMS_CONFIG.authToken);


export const smsService = {
  async sendTemporaryPassword(phoneNumber, temporaryPassword) {
    await client.messages.create({
      body: `Your temporary password for Mitra Agent Portal is: ${temporaryPassword}. Please change it upon first login.`,
      from: SMS_CONFIG.FROM_NUMBER,
      to: phoneNumber,
    });
  },

  async sendPasswordResetCode(phoneNumber, resetCode) {
    await client.messages.create({
      body: `Your password reset code for Mitra Agent Portal is: ${resetCode}. This code will expire in 15 minutes.`,
      from: SMS_CONFIG.FROM_NUMBER,
      to: phoneNumber,
    });
  },
};