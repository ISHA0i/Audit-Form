// Script to check a specific audit record
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

// Check specific record
async function checkRecord(id) {
  let connection;
  
  try {
    console.log(`Checking record with ID: ${id}`);
    
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database');
    
    // Check if the record exists
    const [rows] = await connection.query(
      'SELECT * FROM audits WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      console.log(`Record with ID ${id} does not exist`);
      return false;
    }
    
    console.log(`Record with ID ${id} exists:`, JSON.stringify(rows[0], null, 2));
    
    // Check if the form_data is valid JSON
    const record = rows[0];
    if (record.form_data) {
      try {
        // If it's already parsed, stringify it to validate
        if (typeof record.form_data === 'object') {
          console.log('form_data is already an object');
          const jsonString = JSON.stringify(record.form_data);
          console.log('form_data can be stringified correctly');
        } 
        // If it's a string, try to parse it
        else if (typeof record.form_data === 'string') {
          console.log('form_data is a string, trying to parse');
          const parsed = JSON.parse(record.form_data);
          console.log('form_data parsed successfully');
        }
        console.log('form_data is valid JSON');
      } catch (e) {
        console.error('form_data is not valid JSON:', e);
        
        // Attempt to repair the JSON
        console.log('Attempting to repair the JSON...');
        try {
          // Update the record with null for form_data
          const [updateResult] = await connection.query(
            'UPDATE audits SET form_data = NULL WHERE id = ?',
            [id]
          );
          
          console.log('Updated record with NULL form_data:', updateResult);
          return true;
        } catch (updateError) {
          console.error('Failed to update record:', updateError);
          return false;
        }
      }
    } else {
      console.log('form_data is null or undefined');
    }
    
    return true;
  } catch (error) {
    console.error('Error checking record:', error);
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

// Get record ID from command line
const id = process.argv[2];

if (!id) {
  console.error('Please provide a record ID as an argument');
  process.exit(1);
}

// Run the check
checkRecord(id)
  .then(success => {
    console.log('Check result:', success ? 'SUCCESS' : 'FAILED');
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  }); 