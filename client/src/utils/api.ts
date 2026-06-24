import axios from 'axios';

// incase env variable is not set, default to localhost
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

const soilAppClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

soilAppClient.interceptors.request.use((req) => {
  const userToken = localStorage.getItem('token');
  if (userToken) {
    req.headers.Authorization = `Bearer ${userToken}`;
  }
  return req;
});

export default soilAppClient;