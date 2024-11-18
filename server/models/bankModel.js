import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const bankModel = {
  async create(bankData) {
    const id = uuidv4();
    
    const [result] = await pool.query(
      `INSERT INTO banks (id, name, registration_number, address)
       VALUES (?, ?, ?, ?)`,
      [id, bankData.name, bankData.registrationNumber, bankData.address]
    );
    
    return { id, ...bankData };
  },

  async getAll() {
    const [rows] = await pool.query('SELECT * FROM banks');
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM banks WHERE id = ?', [id]);
    return rows[0];
  },

  async update(id, bankData) {
    const [result] = await pool.query(
      `UPDATE banks 
       SET name = ?, registration_number = ?, address = ?, status = ?
       WHERE id = ?`,
      [bankData.name, bankData.registrationNumber, bankData.address, 
       bankData.status, id]
    );
    
    return result.affectedRows > 0;
  }
};