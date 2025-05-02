/**
 * Setup Script
 * This script copies env.example to .env if .env doesn't exist
 */

const fs = require('fs');
const path = require('path');

const envExamplePath = path.join(__dirname, '../env.example');
const envPath = path.join(__dirname, '../.env');

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  try {
    // Copy env.example to .env
    fs.copyFileSync(envExamplePath, envPath);
    console.log('.env file created successfully from env.example');
    console.log('Please update the .env file with your database credentials.');
  } catch (error) {
    console.error('Error creating .env file:', error);
  }
} else {
  console.log('.env file already exists.');
}

// Print a reminder about MySQL settings
console.log('\nReminder: Make sure your MySQL server is running and the credentials in .env are correct.');
console.log('Default database configuration:');
console.log('- Host: localhost');
console.log('- Port: 3306');
console.log('- User: root');
console.log('- Database: cybersecurity_audit');
console.log('\nRun the following command to initialize the database:');
console.log('npm run init-db'); 