import axios from '../../../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      platform: {},
      platformLoading: true
    };
  },
  mutations: {
    setPlatform(state, payload) {
      state.platform = payload;
    },
    setPlatformLoading(state, payload) {
      state.platformLoading = payload;
    }
  },
  actions: {
    async getPlatform(context, payload) {
      await axios.get('/survey/platform/detail', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setPlatform', res.data);
          context.commit('setPlatformLoading', false);
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
