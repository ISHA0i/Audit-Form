// Script to test the audits API endpoint
import fetch from 'node-fetch';

async function testAuditsAPI() {
  try {
    console.log('Testing connection to audits API endpoint...');
    const response = await fetch('http://localhost:5000/api/audits');
    
    if (response.ok) {
      const data = await response.json();
      console.log('API request successful');
      console.log('Data structure:', JSON.stringify(data, null, 2));
    } else {
      console.error('API request failed. Status:', response.status);
      const errorText = await response.text();
      console.error('Error response:', errorText);
    }
  } catch (error) {
    console.error('Error connecting to API:', error.message);
  }
}

testAuditsAPI(); 