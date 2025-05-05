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
  }
};

export default api; 