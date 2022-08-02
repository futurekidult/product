import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';
import store from './store/index';
import BaseBreadcrumb from './components/common/base-breadcrumb.vue';
import BasePagination from './components/common/base-pagination.vue';
import BaseTag from './components/common/base-tag.vue';
import 'element-plus/dist/index.css';
import { ElMessage } from 'element-plus';

let version = process.env.VERSION;
let localVersion = localStorage.getItem('projectVersion');
if (!localVersion || version !== localVersion) {
  localStorage.removeItem('params');
  localStorage.setItem('projectVersion', version);
}

const app = createApp(App);

app.component('BaseBreadcrumb', BaseBreadcrumb);
app.component('BasePagination', BasePagination);
app.component('BaseTag', BaseTag);

app.use(router);
app.use(store);
app.config.globalProperties.$message = ElMessage;


app.mount('#app');
