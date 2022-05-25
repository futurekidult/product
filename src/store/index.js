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
      priceRmb: ''
    };
  },
  mutations: {
    setSystemParams(state, payload) {
      state.systemParams = payload;
    },
    setPriceRmb(state, payload) {
      state.priceRmb = payload;
    }
  },
  actions: {
    async getPriceRmb(context, payload) {
      await axios.get('/rmb-of-price/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setPriceRmb', res.data.price_rmb);
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
          ElMessage.error(res.data);
        }
      });
    }
  }
});

export default store;
