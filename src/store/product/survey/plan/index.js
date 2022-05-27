import axios from '../../../../utils/axios.js';
import { ElMessage } from 'element-plus';
export default {
  namespaced: true,
  state() {
    return {
      plan: {},
      planLoading: true
    };
  },
  mutations: {
    setPlan(state, payload) {
      state.plan = payload;
    },
    setPlanLoading(state, payload) {
      state.planLoading = payload;
    }
  },
  actions: {
    async getPlan(context, payload) {
      await axios.get('/survey/solutions/detail', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setPlan', res.data);
          context.commit('setPlanLoading', false);
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
