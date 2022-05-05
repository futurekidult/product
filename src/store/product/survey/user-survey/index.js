import axios from '../../../../utils/axios.js';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  state() {
    return {
      buttonState: {},
      progress: {},
      surveyApply: [],
      planList: []
    };
  },
  mutations: {
    setButtonState(state, payload) {
      state.buttonState = payload;
    },
    setProgressData(state, payload) {
      state.progress = payload;
    },
    setSurveyApply(state, payload) {
      state.surveyApply = payload;
    },
    setPlanList(state, payload) {
      state.planList = payload;
    }
  },
  actions: {
    async getUserSurveyData(context, payload) {
      await axios.get('/survey/user-survey/detail', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setButtonState', res.data.button_state);
          context.commit('setProgressData', res.data.progress);
          context.commit('setSurveyApply', res.data.survey_apply);
          context.commit('setPlanList', res.data.plan_list);
        } else {
          ElMessage.error(res.message);
        }
      });
    }
  }
};
