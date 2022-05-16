import axios from '../../../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      progress: {},
      platformForm: {}
    };
  },
  mutations: {
    setProcessData(state, payload) {
      state.progress = payload;
    },
    setFormData(state, payload) {
      state.platformForm = payload;
    }
  },
  actions: {
    async getPlatformData(context, payload) {
      await axios.get('/survey/platform/detail', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setFormData', res.data.report);
          context.commit('setProcessData', res.data.progress);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async submitPlatform(_, payload) {
      await axios.post('/survey/platform/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    }
  }
};
