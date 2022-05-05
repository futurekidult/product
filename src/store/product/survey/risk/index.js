import axios from '../../../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      progress: {},
      riskForm: {}
    };
  },
  mutations: {
    setProgressData(state, payload) {
      state.progress = payload;
    },
    setPlanformData(state, payload) {
      state.riskForm = payload;
    }
  },
  actions: {
    async getRiskData(context, payload) {
      await axios.get('/survey/risk/detail', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setProgressData', res.data.progress);
          context.commit('setPlanformData', res.data.report);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async submitRisk(_, payload) {
      await axios.post('/survey/risk/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    }
  }
};
