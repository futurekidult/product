import axios from '../../../../utils/axios.js';
import { ElMessage } from 'element-plus';
export default {
  namespaced: true,
  state() {
    return {
      progress: {},
      planForm: {}
    };
  },
  mutations: {
    setProgressData(state, payload) {
      state.progress = payload;
    },
    setPlanformData(state, payload) {
      state.planForm = payload;
    }
  },
  actions: {
    async getPlanData(context, payload) {
      await axios.get('/survey/solutions/detail', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setProgressData', res.data.progress);
          context.commit('setPlanformData', res.data.report);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async submitPlan(_, payload) {
      await axios.post('/survey/solutions/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    }
  }
};
