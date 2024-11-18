import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const requestModel = {
  async create(requestData) {
    const id = uuidv4();
    
    const [result] = await pool.query(
      `INSERT INTO requests (id, agent_id, status, type, data)
       VALUES (?, ?, ?, ?, ?)`,
      [id, requestData.agentId, requestData.status, requestData.type, 
       JSON.stringify(requestData.data)]
    );
    
    return { id, ...requestData };
  },

  async getByBank(bankId) {
    const [rows] = await pool.query(
      `SELECT r.*, u.first_name, u.last_name, a.name as agency_name
       FROM requests r
       JOIN users u ON r.agent_id = u.id
       LEFT JOIN agencies a ON u.agency_id = a.id
       WHERE u.bank_id = ?`,
      [bankId]
    );
    return rows;
  },

  async updateStatus(id, status, comment) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query(
        'UPDATE requests SET status = ? WHERE id = ?',
        [status, id]
      );

      if (comment) {
        const commentId = uuidv4();
        await conn.query(
          `INSERT INTO request_comments (id, request_id, user_id, comment)
           VALUES (?, ?, ?, ?)`,
          [commentId, id, comment.userId, comment.text]
        );
      }

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },

  async addValidation(requestId, validation) {
    const id = uuidv4();
    
    const [result] = await pool.query(
      `INSERT INTO request_validations 
       (id, request_id, field_key, status, comment, validated_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, requestId, validation.fieldKey, validation.status, 
       validation.comment, validation.validatedBy]
    );
    
    return result.affectedRows > 0;
  }
};