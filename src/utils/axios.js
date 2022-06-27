import axios from 'axios';
import { ElMessage } from 'element-plus';

axios.defaults.withCredentials = true;

const http = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

http.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.headers['X-CSRFToken'] = localStorage.getItem('token');
  }
  return config;
});

http.interceptors.response.use((res) => {
  let { code } = res.data.code;
  if (code !== 200) {
    if (code === 401) {
      localStorage.removeItem('token');
      window.location.href = res.data.data.auth_url;
    } else if (code === 403) {
      ElMessage.error('no permission to access it');
    } else if (code === 405) {
      getCsrftoken(res.config);
    } else {
      ElMessage.error(res.data.message);
    }
    throw new Error();
  }
  return res.data;
}, (err) => {
  if(err.response) {
    ElMessage.error('服务器出错');
  }
});

const getCsrftoken = async (config) => {
  await http.get('/csrftoken/get').then((res) => {
    localStorage.setItem('token', res.data.csrftoken);
  });
  http.request(config);
}

export default http;
