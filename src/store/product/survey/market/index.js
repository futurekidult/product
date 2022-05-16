import axios from '../../../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      market: {}
    };
  },
  mutations: {
    setMarketData(state, payload) {
      state.market = payload;
    }
  },
  actions: {
    async getMarketData(context, payload) {
      await axios.get('/survey/market/detail', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setMarketData', res.data);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async submitMarketFile(_, payload) {
      await axios.post('/survey/market/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    }
  },
  getters: {
    getMarketList(state) {
      return state.market;
    }
  }
};
