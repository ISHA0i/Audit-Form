/**
 * API utility for communicating with the backend
 */

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Generic fetch function with error handling
 */
async function fetchWithErrorHandling(url, options = {}) {
  try {
    console.log(`Sending request to: ${url}`);
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData?.message || errorData?.error || `Status: ${response.status}`;
      } catch {
        errorMessage = `API error: ${response.status} ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * API functions
 */
const api = {
  // Submit audit form
  submitAudit: async (formData) => {
    console.log('Submitting audit form:', formData);
    return fetchWithErrorHandling(`${API_BASE_URL}/audits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
  },
  
  // Get all audits
  getAudits: async () => {
    return fetchWithErrorHandling(`${API_BASE_URL}/audits`);
  },
  
  // Get specific audit by ID
  getAuditById: async (id) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/audits/${id}`);
  },
  
  // Update an audit
  updateAudit: async (id, formData) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/audits/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
  },
  
  // Delete an audit
  deleteAudit: async (id) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/audits/${id}`, {
      method: 'DELETE',
    });
  }
};

export default api; 