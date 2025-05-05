// Database connection test script
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MySQL connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cybersecurity_audit',
  port: process.env.DB_PORT || 3306
};

// Test connection
async function testConnection() {
  let connection;
  
  try {
    console.log('Testing database connection with config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port
    });
    
    // First test if we can connect to MySQL server
    const tempConfig = { ...dbConfig };
    delete tempConfig.database; // Remove database from config to test server connection
    
    try {
      connection = await mysql.createConnection(tempConfig);
      console.log('Successfully connected to MySQL server');
      
      // Check if database exists
      const [rows] = await connection.query(
        `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`, 
        [dbConfig.database]
      );
      
      if (rows.length === 0) {
        console.log(`Database '${dbConfig.database}' does not exist. Creating...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
        console.log(`Database '${dbConfig.database}' created successfully`);
      } else {
        console.log(`Database '${dbConfig.database}' exists`);
      }
      
      await connection.end();
      
      // Now try to connect with the database
      connection = await mysql.createConnection(dbConfig);
      console.log(`Successfully connected to database '${dbConfig.database}'`);
      
      // Check if audits table exists
      const [tables] = await connection.query(
        `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'audits'`, 
        [dbConfig.database]
      );
      
      if (tables.length === 0) {
        console.log("'audits' table does not exist. Creating...");
        
        await connection.query(`
          CREATE TABLE audits (
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
            submission_date DATETIME NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `);
        
        console.log("'audits' table created successfully");
      } else {
        console.log("'audits' table exists");
      }
      
      console.log('Database connection test completed successfully');
      return true;
    } catch (error) {
      console.error('Error connecting to MySQL server:', error);
      return false;
    }
  } catch (error) {
    console.error('Error in database connection test:', error);
    return false;
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

// Run the test
testConnection()
  .then(success => {
    console.log('Test result:', success ? 'SUCCESS' : 'FAILED');
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  }); 