// Simple script to test the API connection
import fetch from 'node-fetch';

async function testAPI() {
  try {
    console.log('Testing connection to backend API...');
    const response = await fetch('http://localhost:5000/health');
    
    if (response.ok) {
      const data = await response.json();
      console.log('API health check successful:', data);
    } else {
      console.error('API health check failed. Status:', response.status);
    }
  } catch (error) {
    console.error('Error connecting to API:', error.message);
  }
}

testAPI(); 