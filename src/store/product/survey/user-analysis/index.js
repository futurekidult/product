import axios from '../../../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      userAnalysis: {},
      analysisLoading: true,
      ids: {}
    };
  },
  mutations: {
    setUserAnalysis(state, payload) {
      state.userAnalysis = payload;
      state.ids = {
        survey_id: payload.survey_id,
        survey_schedule_id: payload.survey_schedule_id
      };
    },
    setAnalysisLoading(state, payload) {
      state.analysisLoading = payload;
    }
  },
  actions: {
    async getAnalysis(context, payload) {
      await axios.get('/survey/user-analysis/detail', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setUserAnalysis', res.data);
          context.commit('setAnalysisLoading', false);
        }
      });
    },
    async submitAnalysis(_, payload) {
      await axios.post('/survey/user-analysis/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    }
  }
};
