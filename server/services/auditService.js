import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/audit.log' }),
  ],
});

export const auditService = {
  async logAction(userId, actionType, entityType, entityId, details, ipAddress) {
    const id = uuidv4();
    
    try {
      await pool.query(
        `INSERT INTO audit_logs (id, user_id, action_type, entity_type, entity_id, details, ip_address)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, userId, actionType, entityType, entityId, JSON.stringify(details), ipAddress]
      );

      // Also log to Winston for external logging
      logger.info('Audit log entry', {
        userId,
        actionType,
        entityType,
        entityId,
        details,
        ipAddress,
      });

    } catch (error) {
      console.error('Failed to create audit log:', error);
      throw error;
    }
  },

  async logLoginAttempt(userId, success, ipAddress) {
    const actionType = success ? 'login_success' : 'login_failed';
    
    await this.logAction(
      userId,
      actionType,
      'user',
      userId,
      { success },
      ipAddress
    );

    if (!success) {
      await pool.query(
        `INSERT INTO failed_login_attempts (id, user_id, ip_address)
         VALUES (?, ?, ?)`,
        [uuidv4(), userId, ipAddress]
      );
    }
  },

  async logPasswordReset(userId, resetType, ipAddress) {
    await pool.query(
      `INSERT INTO password_reset_history (id, user_id, reset_type, ip_address)
       VALUES (?, ?, ?, ?)`,
      [uuidv4(), userId, resetType, ipAddress]
    );

    await this.logAction(
      userId,
      'password_reset',
      'user',
      userId,
      { resetType },
      ipAddress
    );
  },

  async getAuditLogs(filters = {}) {
    let query = `
      SELECT al.*, u.email as user_email
      FROM audit_logs al
      JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;
    
    const params = [];

    if (filters.userId) {
      query += ' AND al.user_id = ?';
      params.push(filters.userId);
    }

    if (filters.actionType) {
      query += ' AND al.action_type = ?';
      params.push(filters.actionType);
    }

    if (filters.entityType) {
      query += ' AND al.entity_type = ?';
      params.push(filters.entityType);
    }

    if (filters.startDate) {
      query += ' AND al.created_at >= ?';
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ' AND al.created_at <= ?';
      params.push(filters.endDate);
    }

    query += ' ORDER BY al.created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  },
};