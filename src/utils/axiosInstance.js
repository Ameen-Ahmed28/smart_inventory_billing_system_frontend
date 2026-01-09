import axios from 'axios';

const axiosInstance = axios.create({
    baseURL
    // : 'http://localhost:8080/api',
    : 'https://smart-inventory-billing-system-backend.onrender.com'    
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    // Firebase uses accessToken, legacy uses token
    const token = user?.accessToken || user?.token;
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
