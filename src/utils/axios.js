import axios from 'axios';
import { ElMessage } from 'element-plus';

axios.defaults.withCredentials = true;

const http = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

let isRefreshing = false;
let requests = [];

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
      if(process.env.NODE_ENV === 'development') {
        await devLogin(); 
        return http(res.config);
      } else {
        window.location.href = res.data.data.auth_url;
      }
    } else if (code === 403) {
      ElMessage.error('无权限访问');
    } else if (code === 405) {  
          let { config } = res;
          if(!isRefreshing) {
            isRefreshing = true;
            return await refreshToken().then((response) => { 
              let token = response.csrftoken;
              config.headers['X-CSRFToken'] = token;
              localStorage.setItem('token', token);
              config.baseURL = '/api';
              requests.forEach((cb) => { cb(token) });
              requests = [];
              return http(config);
            }).finally(() => {
              isRefreshing = false;
            })
          } else {
            return new Promise((resolve) => {
              requests.push((token) => {
                config.baseURL = '/api';
                config.headers['X-CSRFToken'] = token;
                resolve(http(config));
              })
            })
          }
    } else {
      ElMessage.error(res.data.message);
    }
    throw new Error(code);
  }
  return res.data;
  }, (err) => {
    if(err.response) {
      ElMessage.error('服务器出错');
    }
});

const refreshToken = async () => {
  return await http.get('/csrftoken/get').then((res) => { return res.data });
}

const devLogin = async () => {
  await http.get('/login?id=12').then((res) => {
    return res.data;
  })
}

export default http;
