import { createStore } from 'vuex';
import { ElMessage } from 'element-plus';
import WorkBench from './workbench';
import DemandList from './demand';
import ProductList from './product';
import SampleList from './sample';
import axios from '../utils/axios.js';
import MouldList from './mould';
import PriceList from './price';
import SupplierList from './supplier';
import SystemList from './system';

const store = createStore({
  modules: {
    workbench: WorkBench,
    demand: DemandList,
    product: ProductList,
    sample: SampleList,
    mould: MouldList,
    price: PriceList,
    supplier: SupplierList,
    system: SystemList
  },
  state() {
    return {
      systemParams: {},
      priceRmb: '',
      platform: [],
      getRmbState: false,
      uploadState: false,
      fileRes: {},
      viewLink: '',
      attachmentState: false,
      userInfo: {},
      activeTab: '',
      entry: '',
      regionList: [],
      cityList: [],
      menuData: {}
    };
  },
  mutations: {
    setSystemParams(state, payload) {
      state.systemParams = payload;
    },
    setPriceRmb(state, payload) {
      state.priceRmb = payload;
    },
    setPlatform(state, payload) {
      state.platform = payload;
    },
    setUploadState(state, payload) {
      state.uploadState = payload;
    },
    setFileResponse(state, payload) {
      state.fileRes = payload;
    },
    setViewLink(state, payload) {
      state.viewLink = payload;
    },
    setAttachmentState(state, payload) {
      state.attachmentState = payload;
    },
    setUserInfo(state, payload) {
      state.userInfo = payload;
    },
    setActiveTab(state, payload) {
      state.activeTab = payload;
    },
    setEntry(state, payload) {
      state.entry = payload;
    },
    setRegionList(state, payload) {
      state.regionList = payload;
    },
    setCityList(state, payload) {
      state.cityList = payload;
    },
    setMenuList(state, payload) {
      state.menuList = payload;
    },
    setMenuData(state, payload) {
      state.menuData = payload;
    }
  },
  actions: {
    async getPriceRmb(context, payload) {
      await axios.get('/pricing/rmb-of-price/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setPriceRmb', res.data.price_rmb);
          context.state.getRmbState = true;
        }
      });
    },
    async getSystemParameters(context) {
      await axios.get('/option/system-parameter/list').then((res) => {
        if (res.code === 200) {
          context.commit('setSystemParams', res.data);
          localStorage.setItem('params', JSON.stringify(res.data));
        }
      });
    },
    async getPlatform(context, payload) {
      await axios.get('/option/pricing/platform/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setPlatform', res.data.list);
        }
      });
    },
    async uploadFile(context, payload) {
      await axios.post('/attachment/upload', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
          context.commit('setUploadState', true);
          context.commit('setFileResponse', res.data);
        }
      });
    },
    async getViewLink(context, payload) {
      await axios.get('/attachment/view', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setViewLink', res.data.url);
          context.commit('setAttachmentState', true);
        }
      });
    },
    async getOrganizationList() {
      await axios.get('/organization/list').then((res) => {
        if (res.code === 200) {
          localStorage.setItem('organization', JSON.stringify(res.data.list));
        }
      });
    },
    async getCountry() {
      await axios.get('/option/country/list').then((res) => {
        if (res.code === 200) {
          localStorage.setItem('country', JSON.stringify(res.data.list));
        }
      });
    },
    async getRegionList(context, payload) {
      await axios.get('/option/state/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setRegionList', res.data.list);
        }
      });
    },
    async getCityList(context, payload) {
      await axios.get('/option/city/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setCityList', res.data.list);
        }
      });
    },
    async getToken() {
      await axios.get('/csrftoken/get').then((res) => {
        if (res.code === 200) {
          localStorage.setItem('token', res.data.csrftoken);
        }
      });
    },
    async getUserInfo(context) {
      await axios.get('/admin/info').then((res) => {
        if (res.code === 200) {
          context.commit('setUserInfo', res.data);
          context.commit('setMenuData', res.data.menu);
          localStorage.setItem('center_group', JSON.stringify(res.data.center_group));
        }
      });
    },
    async logoutSystem() {
      await axios.get('/logout').then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    }
  }
});

export default store;
