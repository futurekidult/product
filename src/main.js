import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';
import store from './store/index';
import BaseBreadcrumb from './components/common/base-breadcrumb.vue';
import BasePagination from './components/common/base-pagination.vue';
import BaseTag from './components/common/base-tag.vue';
import 'element-plus/dist/index.css';
import ElementPlus from 'element-plus';

const app = createApp(App);

app.component('BaseBreadcrumb', BaseBreadcrumb);
app.component('BasePagination', BasePagination);
app.component('BaseTag', BaseTag);

app.use(router);
app.use(store);

app.use(ElementPlus);

app.mount('#app');
