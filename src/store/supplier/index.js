import { ElMessage } from 'element-plus';
import axios from '../../utils/axios.js';

export default {
  namespaced: true,
  state() {
    return {
      supplierList: []
    };
  },
  mutations: {
    setSupplierList(state, payload) {
      state.supplierList = payload;
    }
  },
  actions: {
    async getSupplierList(context, payload) {
      await axios.get('/supplier/white/list', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setSupplierList', res.data.list);
        } else {
          ElMessage.error(res.message);
        }
      });
    }
  }
};
