import axios from '../../../../utils/axios.js';
import { ElMessage } from 'element-plus';
import { deleteEmptyValue } from '../../../../utils/index';

export default {
  namespaced: true,
  state() {
    return {
      platform: {},
      platformLoading: true,
      ids: {}
    };
  },
  mutations: {
    setPlatform(state, payload) {
      state.platform = payload;
      state.ids = {
        survey_id: payload.survey_id,
        survey_schedule_id: payload.survey_schedule_id
      };
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
        }
      });
    },
    async submitPlatform(_, payload) {
      deleteEmptyValue(payload);
      await axios.post('/survey/platform/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    }
  }
};
