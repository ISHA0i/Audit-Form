/**
 * Database Initialization Script
 * This script creates the cybersecurity_audit database and required tables
 */

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 3306
};

console.log('Database configuration:', {
  host: dbConfig.host,
  user: dbConfig.user,
  port: dbConfig.port,
  // Not printing password for security
  database: process.env.DB_NAME || 'cybersecurity_audit'
});

// Database and tables creation queries
const createDatabase = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'cybersecurity_audit'};`;

const useDatabaseQuery = `USE ${process.env.DB_NAME || 'cybersecurity_audit'};`;

const createAuditsTable = `
CREATE TABLE IF NOT EXISTS audits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  organization_name VARCHAR(255) NOT NULL,
  industry_type VARCHAR(100),
  address TEXT,
  contact_person VARCHAR(255) NOT NULL,
  designation VARCHAR(100),
  contact_number VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  total_employees INT,
  num_departments INT,
  num_branches INT,
  form_data JSON,
  submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

// Function to initialize the database
async function initializeDatabase() {
  let connection;
  
  try {
    // Create connection
    console.log('Connecting to MySQL server...');
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });
    
    console.log('Connection created successfully');
    
    // Create database if it doesn't exist
    console.log('Creating database...');
    await connection.query(createDatabase);
    
    // Use the database
    console.log('Selecting database...');
    await connection.query(useDatabaseQuery);
    
    // Create tables
    console.log('Creating tables...');
    await connection.query(createAuditsTable);
    
    console.log('Database initialized successfully!');
    
  } catch (error) {
    console.error('Error initializing database:', error);
    if (error.code === 'ECONNREFUSED') {
      console.error('Could not connect to MySQL server. Please make sure the server is running and accessible.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Access denied. Please check your MySQL username and password.');
    } else {
      console.error('Detailed error:', {
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage
      });
    }
  } finally {
    if (connection) {
      console.log('Closing database connection...');
      await connection.end();
      console.log('Connection closed');
    }
  }
}

// Run the initialization function
initializeDatabase(); 