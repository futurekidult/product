import axios from '../../../../utils/axios.js';
import { ElMessage } from 'element-plus';
import { changeRequestValue } from '../../../../utils/index.js';

export default {
  namespaced: true,
  state() {
    return {
      plan: {},
      planLoading: true,
      ids: {}
    };
  },
  mutations: {
    setPlan(state, payload) {
      state.plan = payload;
      state.ids = {
        survey_id: payload.survey_id,
        survey_schedule_id: payload.survey_schedule_id
      };
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
        }
      });
    },
    async submitPlan(_, payload) {
      changeRequestValue([], [], payload);
      await axios.post('/survey/solutions/create', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async updatePlan(_, payload) {
      changeRequestValue(
        [],
        ['head_cost_currency', 'tail_cost_currency', 'sea_freight_currency'],
        payload
      );
      await axios.post('/survey/solutions/update', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    },
    async approvalPlan(_, payload) {
      await axios.post('/survey/solutions/approve', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        }
      });
    }
  }
};
