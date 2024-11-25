import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // Replace with your API base URL
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor (optional)
apiClient.interceptors.request.use(
  (config) => {
    // You can add a token here if needed
    const token = localStorage.getItem('token'); // Example for a stored token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor (optional)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    return Promise.reject(error);
  }
);

export default apiClient;
