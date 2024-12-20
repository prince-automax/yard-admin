// axiosInterceptorInstance.js

import axios from 'axios';

const axiosInstance = axios.create({
//   baseURL: 'https://your-api-base-url.com/', // Replace with your API base URL
  baseURL: 'http://13.232.152.20/api/v1/yms/',
  headers: {
    'Content-Type': 'application/json', // Default headers
  }, // Replace with your API base URL
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify the request config here (add headers, authentication tokens)

    const accessToken = JSON.parse(localStorage.getItem("token"));


    // If token is present, add it to request's Authorization Header
    // If token is present, add it to request's Authorization Header
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
  },
  (error) => {
    // Handle request errors here
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Modify the response data here
    return response;
  },
  (error) => {
    // Handle response errors here
    return Promise.reject(error);
  }
);

export default axiosInstance;