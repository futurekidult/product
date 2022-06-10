import axios from '../../../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      market: {},
      marketLoading: true
    };
  },
  mutations: {
    setMarket(state, payload) {
      state.market = payload;
    },
    setMarketLoading(state, payload) {
      state.marketLoading = payload;
    }
  },
  actions: {
    async getMarket(context, payload) {
      await axios.get('/survey/market/detail', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setMarket', res.data);
          context.commit('setMarketLoading', false);
        }
      });
    },
    async submitMarketFile(_, payload) {
      await axios.post('/survey/market/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    }
  }
};
