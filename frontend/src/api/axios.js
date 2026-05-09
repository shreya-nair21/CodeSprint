import axios from 'axios';
//this is a axios file  to make requests to the backend 
const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/api', // Point to our Express backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
