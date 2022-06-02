import { createStore } from 'vuex';
import WorkBench from './workbench';
import DemandList from './demand';
import ProductList from './product';
import SampleList from './sample';
import axios from '../utils/axios.js';
import MouldList from './mould';
import PriceList from './price';
import SupplierList from './supplier';
import { ElMessage } from 'element-plus';

const store = createStore({
  modules: {
    workbench: WorkBench,
    demand: DemandList,
    product: ProductList,
    sample: SampleList,
    mould: MouldList,
    price: PriceList,
    supplier: SupplierList
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
      organizationList: [],
      countryList: []
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
    setOrganizationList(state, payload) {
      state.organizationList = payload;
    },
    setCountry(state, payload) {
      state.countryList = payload;
    }
  },
  actions: {
    async getPriceRmb(context, payload) {
      await axios.get('/rmb-of-price/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setPriceRmb', res.data.price_rmb);
          context.state.getRmbState = true;
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getSystemParameters(context) {
      await axios.get('/option/system-parameter/list').then((res) => {
        if (res.code === 200) {
          context.commit('setSystemParams', res.data);
          localStorage.setItem('params', JSON.stringify(res.data));
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getPlatform(context, payload) {
      await axios.get('/option/pricing/platform/list/', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setPlatform', res.data.list);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async uploadFile(context, payload) {
      await axios.post('/attachment/upload', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
          context.commit('setUploadState', true);
          context.commit('setFileResponse', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getViewLink(context, payload) {
      await axios.get('/attachment/view', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setViewLink', res.data.url);
          context.commit('setAttachmentState', true);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getOrganizationList(context) {
      await axios.get('/organization/list').then((res) => {
        if (res.code === 200) {
          context.commit('setOrganizationList', res.data.list);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getCountry(context) {
      await axios.get('/option/country/list').then((res) => {
        if (res.code === 200) {
          context.commit('setCountry', res.data.list);
        } else {
          ElMessage.error(res.message);
        }
      });
    }
  }
});

export default store;
