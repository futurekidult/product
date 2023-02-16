import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';
import store from './store/index';
import BaseBreadcrumb from './components/common/base-breadcrumb.vue';
import BasePagination from './components/common/base-pagination.vue';
import BaseTag from './components/common/base-tag.vue';
import ConfirmDialog from './components/common/confirm-dialog.vue';
import BaseDelete from './components/common/base-delete.vue';
import BaseUpload from './components/common/base-upload.vue';
import BaseHandbook from './components/common/base-handbook.vue';
import 'element-plus/dist/index.css';
import global from './components/common/global.vue';
import TextBtn from './components/common/text-btn.vue';
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
app.component('TextBtn', TextBtn);
app.component('ConfirmDialog', ConfirmDialog);
app.component('BaseDelete', BaseDelete);
app.component('BaseUpload', BaseUpload);
app.component('BaseHandbook', BaseHandbook);

app.use(router);
app.use(store);
app.config.globalProperties.$message = ElMessage;
app.config.globalProperties.$global = global;
app.config.globalProperties.$version = '0.0.8';
app.mount('#app');
