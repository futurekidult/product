import axios from 'axios';
import { ElMessage } from 'element-plus';

axios.defaults.withCredentials = true;
axios.defaults.timeout = 7128000;

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

http.interceptors.response.use(async (res) => {
  let { code } = res.data;
  if (code !== 200) {
    if (code === 401) {
      localStorage.removeItem('token');
      // todo 开发和线上分开
      // window.location.href = res.data.data.auth_url;
      await devLogin(); 
      return http(res.config);
    } else if (code === 403) {
      ElMessage.error('no permission to access it');
    } else if (code === 405) {
      let token = await refreshToken(res.config);
      res.config.headers['X-CSRFToken'] = token;
      res.config.baseURL = '/api';
      return http(res.config);
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

const refreshToken = async () => {
  await http.get('/csrftoken/get').then((res) => {
    let { code } = res.data;
    if (code === 200) {
      let token = res.data.csrftoken;
      localStorage.setItem('token', token);
      return token;
    } else {
      ElMessage.error(res.data.message); 
    } 
    }, (err) => {
      if(err.response) {
        ElMessage.error('服务器出错');
      }
  })
}

const devLogin = async () => {
  await http.get('/login?id=1').then((res) => {
    return res.data;
  })
}

export default http;
