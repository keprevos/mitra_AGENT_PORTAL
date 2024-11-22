const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

/**
 * Handles file upload and storage
 * @param {Express.Multer.File} file - The uploaded file
 * @returns {Promise<{url: string, originalName: string, mimeType: string, size: number}>} File info
 */
exports.uploadFile = async (file) => {
  try {
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    const filePath = path.join(uploadsDir, fileName);
    
    // Move file from multer storage to final location
    await fs.rename(file.path, filePath);

    // In production, you would upload to cloud storage (S3, etc.)
    // and return a CDN URL. For development, we'll use a local path
    return {
      url: `/uploads/${fileName}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to upload file');
  }
};

/**
 * Deletes a file from storage
 * @param {string} url - The URL of the file to delete
 * @returns {Promise<void>}
 */
exports.deleteFile = async (url) => {
  try {
    const fileName = url.split('/').pop();
    const filePath = path.join(uploadsDir, fileName);
    await fs.unlink(filePath);
  } catch (error) {
    console.error('File deletion error:', error);
    throw new Error('Failed to delete file');
  }
};