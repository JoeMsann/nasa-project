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