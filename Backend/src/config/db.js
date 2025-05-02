const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// MySQL connection pool configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cybersecurity_audit',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
let pool;

try {
  pool = mysql.createPool(dbConfig);
  console.log('MySQL connection pool created');
} catch (error) {
  console.error('Error creating MySQL connection pool:', error);
}

// Test database connection
async function testConnection() {
  try {
    if (!pool) return false;
    
    const connection = await pool.getConnection();
    console.log('Database connection established');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

module.exports = {
  pool,
  testConnection
}; 