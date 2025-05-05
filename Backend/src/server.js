const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { testConnection } = require('./config/db');

// Load environment variables
dotenv.config();

// Test database connection
testConnection()
  .then((connected) => {
    if (!connected) {
      console.warn('Warning: Database connection failed, server starting without database');
    }
  })
  .catch(err => {
    console.error('Error testing database connection:', err);
  });

// Import routes
const auditRoutes = require('./routes/auditRoutes');
const auditModel = require('./models/auditModel');

// Initialize express app
const app = express();

// CORS configuration - More permissive during development
const corsOptions = {
  origin: '*', // Allow all origins during development
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow cross-origin requests for resources
})); // Security headers
app.use(cors(corsOptions));   // Enable CORS with options
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/api/audits', auditRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Database connection test
app.get('/api/db-test', async (req, res) => {
  try {
    const connectionStatus = await testConnection();
    res.status(200).json({ 
      success: connectionStatus, 
      message: connectionStatus ? 'Database connection successful' : 'Database connection failed' 
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database connection test failed',
      error: error.message 
    });
  }
});

// Database initialization endpoint
app.get('/api/db-init', async (req, res) => {
  try {
    const tableCheck = await auditModel.checkTable();
    res.status(200).json(tableCheck);
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Database initialization failed',
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    message: err.message || 'Internal Server Error',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 