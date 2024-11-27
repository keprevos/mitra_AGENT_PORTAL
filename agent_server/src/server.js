const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import models and initialize associations
require('./models/index');
const sequelize = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const agencyRoutes = require('./routes/agency');
const bankRoutes = require('./routes/bank');
const bankStaffRoutes = require('./routes/bankStaff');
const rolesRoutes = require('./routes/roles');
const onboardingRoutes = require('./routes/onboarding');

// Create Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/agencies', agencyRoutes);
app.use('/api/banks', bankRoutes);
app.use('/api/bank-staff', bankStaffRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/onboarding', onboardingRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Database sync and server start
const PORT = process.env.PORT || 3000;

// Only sync in development
const syncOptions = {
  alter: process.env.NODE_ENV === 'development'
};

// Initialize database and start server
async function startServer() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Sync models if in development
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync(syncOptions);
      console.log('Database synced.');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Start the server
startServer();