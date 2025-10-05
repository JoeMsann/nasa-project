import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const processMessage = async (userInput, csvData = null) => {
  try {
    const response = await api.post('/chat', {
      user_input: userInput,
      attached_table: csvData,
    });

    return response.data.response;
  } catch (error) {
    console.error('API Error:', error);

    if (error.response) {
      throw new Error(error.response.data.detail || 'Server error occurred');
    } else if (error.request) {
      throw new Error('Unable to connect to the server. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Helper function to detect if input is a vector
const isVectorInput = (input) => {
  // Check if input looks like a vector (array of numbers)
  const trimmed = input.trim();

  // Simple heuristic: contains brackets and commas with numbers
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return true;
  }

  // Or comma-separated numbers
  const parts = trimmed.split(',');
  if (parts.length >= 100) { // NASA vectors should have 122 elements
    const numbersCount = parts.filter(part => {
      const num = parseFloat(part.trim());
      return !isNaN(num) && isFinite(num);
    }).length;

    // If most parts are valid numbers (including scientific notation), likely a vector
    return numbersCount / parts.length > 0.9;
  }

  return false;
};

export const processGeneralMessage = async (userInput) => {
  try {
    const response = await api.post('/chat', {
      user_input: userInput,
      attached_table: null,
    });

    return {
      response: response.data.response,
      isExoplanetAnalysis: false
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const processVectorAnalysis = async (vectorInput) => {
  try {
    const response = await api.post('/chat', {
      user_input: vectorInput,
      attached_table: null,
    });

    return {
      response: response.data.response,
      isExoplanetAnalysis: true
    };
  } catch (error) {
    console.error('Vector Analysis Error:', error);
    throw error;
  }
};

export const processSmartMessage = async (userInput, csvData = null) => {
  try {
    // Determine if this is vector analysis or general conversation
    // const isVector = isVectorInput(userInput);
    const isVector = true

    const response = await api.post('/chat', {
      user_input: userInput,
      attached_table: csvData,
    });

    return {
      response: response.data.response,
      isExoplanetAnalysis: isVector || (csvData !== null)
    };
  } catch (error) {
    console.error('API Error:', error);

    if (error.response) {
      throw new Error(error.response.data.detail || 'Server error occurred');
    } else if (error.request) {
      throw new Error('Unable to connect to the server. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const uploadAndAnalyzeCsv = async (file) => {
  try {
    const text = await file.text();
    const fileName = file.name;

    const response = await api.post('/chat', {
      user_input: `Analyze the uploaded CSV file: ${fileName}`,
      attached_table: text,
    });

    return response.data.response;
  } catch (error) {
    console.error('CSV Upload Error:', error);

    if (error.response) {
      throw new Error(error.response.data.detail || 'Failed to analyze CSV file');
    } else if (error.request) {
      throw new Error('Unable to connect to the server. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred while processing the file');
    }
  }
};

export default api;