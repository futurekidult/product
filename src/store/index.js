import { createStore } from 'vuex';
import WorkBench from './workbench';
import DemandList from './demand';
import ProductList from './product';
import SampleList from './sample';
import axios from '../utils/axios.js';
import { ElMessage } from 'element-plus';
import MouldList from './mould';

let dataCache = new Map();
const store = createStore({
  modules: {
    workbench: WorkBench,
    demand: DemandList,
    product: ProductList,
    sample: SampleList,
    mould: MouldList
  },
  state() {
    return {
      allMouldList: []
    };
  },
  mutations: {
    setAllMouldList(state, payload) {
      state.allMouldList = payload;
    }
  },
  actions: {
    async getSystemParameter() {
      let key = 'parameter';
      let data = dataCache.get(key);
      if (!data) {
        await axios.get('/option/system-parameter/list').then((res) => {
          if (res.code === 200) {
            let param = res.data;
            dataCache.set(key, param);
          }
        });
      }
      return dataCache;
    },
    async getAllMouldList(context, payload) {
      await axios.get('/mould/all/list/', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setMouldList', res.data.list);
        } else {
          ElMessage.error(res.message);
        }
      });
    }
  }
});

export default store;
