import axios from '../../utils/axios';
import { ElMessage } from 'element-plus';
import Survey from './survey/index.js';
import Patent from './patent/index.js';
import Order from './order/index.js';
import Project from './project/index.js';

export default {
  namespaced: true,
  modules: {
    survey: Survey,
    patent: Patent,
    order: Order,
    project: Project
  },
  state() {
    return {
      productList: [],
      total: 0,
      singleProductDetail: {},
      productId: 0
    };
  },
  mutations: {
    setProduct(state, payload) {
      state.productList = payload;
    },
    setLength(state, payload) {
      state.total = payload;
    },
    setSingleProductDetail(state, payload) {
      state.singleProductDetail = payload;
    }
  },
  actions: {
    async getProductList(context, payload) {
      await axios.get('/product/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setProduct', res.data.list);
          context.commit('setLength', res.data.total);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async getSingleDetailMsg(context, payload) {
      await axios.get('/product/detail/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSingleProductDetail', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async updateSingleProductMsg(_, payload) {
      await axios.post('/product/update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.msg);
        } else {
          ElMessage.error(res.msg);
        }
      });
    }
  },
  getters: {
    getProductList(state) {
      return state.productList;
    },
    getLength(state) {
      return state.total;
    },
    getSingleDetailMsg(state) {
      return state.singleProductDetail;
    }
  }
};
