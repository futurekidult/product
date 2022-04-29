import axios from 'axios';

axios.defaults.withCredentials = true;

const http = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

http.interceptors.request.use((config) => {
  return config;
});

http.interceptors.response.use((res) => {
  return res.data;
});

export default http;
