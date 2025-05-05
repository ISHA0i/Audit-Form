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
    
    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId); // Clear the timeout
      
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorData?.error || `Status: ${response.status}`;
          if (errorData?.details) {
            errorMessage += ` - ${errorData.details}`;
          }
        } catch {
          errorMessage = `API error: ${response.status} ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return data;
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timed out. Please try again later.');
      }
      throw fetchError;
    }
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
    try {
      console.log(`Deleting audit with ID: ${id}`);
      
      if (!id) {
        throw new Error('No audit ID provided for deletion');
      }
      
      return fetchWithErrorHandling(`${API_BASE_URL}/audits/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      console.error('Delete audit error:', error);
      throw error;
    }
  },
  
  // Download audits as XLSX
  downloadAuditsXlsx: async () => {
    try {
      console.log('Downloading audits as XLSX');
      
      // For file downloads, we need to handle the response differently
      const response = await fetch(`${API_BASE_URL}/audits/download/xlsx`);
      
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorData?.error || `Status: ${response.status}`;
        } catch {
          errorMessage = `API error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Set the file name from Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'cybersecurity_audits.xlsx';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]*)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return { success: true, message: 'Download started' };
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }
};

export default api; 