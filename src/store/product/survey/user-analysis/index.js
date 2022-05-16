import axios from '../../../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      progress: {},
      analysisForm: {}
    };
  },
  mutations: {
    setProgressData(state, payload) {
      state.progress = payload;
    },
    setFormData(state, payload) {
      state.analysisForm = payload;
    }
  },
  actions: {
    async getAnalysisData(context, payload) {
      await axios.get('/survey/user-analysis/detail', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setProgressData', res.data.progress);
          context.commit('setFormData', res.data.report);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async submitAnalysis(_, payload) {
      await axios.post('/survey/user-analysis/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    }
  }
};
