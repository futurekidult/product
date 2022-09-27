import axios from '../../../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      market: {},
      marketLoading: true,
      ids: {}
    };
  },
  mutations: {
    setMarket(state, payload) {
      state.market = payload;
      state.ids = {
        survey_id: payload.survey_id,
        survey_schedule_id: payload.survey_schedule_id
      };
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
