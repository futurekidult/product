import axios from '../../../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      risk: {},
      riskLoading: true
    };
  },
  mutations: {
    setRisk(state, payload) {
      state.risk = payload;
    },
    setRiskLoading(state, payload) {
      state.riskLoading = payload;
    }
  },
  actions: {
    async getRisk(context, payload) {
      await axios.get('/survey/risk/detail', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setRisk', res.data);
          context.commit('setRiskLoading', false);
        }
      });
    },
    async submitRisk(_, payload) {
      await axios.post('/survey/risk/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    }
  }
};
