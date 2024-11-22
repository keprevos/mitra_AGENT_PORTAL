const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

/**
 * Handles file upload and storage
 * @param {Express.Multer.File} file - The uploaded file
 * @returns {Promise<{url: string}>} The URL of the stored file
 */
exports.uploadFile = async (file) => {
  try {
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    const filePath = path.join(uploadsDir, fileName);
    
    // Create a write stream and pipe the file buffer to it
    await fs.writeFile(filePath, file.buffer);

    // In production, you would upload to cloud storage (S3, etc.)
    // and return a CDN URL. For development, we'll use a local path
    return {
      url: `/uploads/${fileName}`,
      path: filePath
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to upload file');
  }
};