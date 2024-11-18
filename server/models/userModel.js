import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const userModel = {
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  async create(userData) {
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const [result] = await pool.query(
      `INSERT INTO users (id, email, password, first_name, last_name, role, bank_id, agency_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, userData.email, hashedPassword, userData.firstName, userData.lastName, 
       userData.role, userData.bankId, userData.agencyId]
    );
    
    return { id, ...userData };
  },

  async updateLastLogin(userId) {
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [userId]
    );
  },

  async getAgentsByBank(bankId) {
    const [rows] = await pool.query(
      `SELECT u.*, a.name as agency_name 
       FROM users u 
       LEFT JOIN agencies a ON u.agency_id = a.id 
       WHERE u.bank_id = ? AND u.role = 'agent'`,
      [bankId]
    );
    return rows;
  }
};