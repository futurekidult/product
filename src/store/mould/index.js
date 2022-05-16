import axios from '../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      mouldList: []
    };
  },
  mutations: {
    setMouldList(state, payload) {
      state.mouldList = payload;
    }
  },
  actions: {
    async getMouldList(context, payload) {
      await axios.get('/mould/all/list/', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setMouldList', res.data.list);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async createMould(_, payload) {
      await axios.post('/mould/detail/create/', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    }
  }
};
