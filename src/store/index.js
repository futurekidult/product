import { createStore } from 'vuex';
import WorkBench from './workbench';
import DemandList from './demand';
import ProductList from './product';
import SampleList from './sample';
import axios from '../utils/axios.js';
// import { ElMessage } from 'element-plus';
import MouldList from './mould';
import PriceList from './price';
import SupplierList from './supplier';

let dataCache = new Map();
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
    return {};
  },
  mutations: {},
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
    }
  }
});

export default store;
