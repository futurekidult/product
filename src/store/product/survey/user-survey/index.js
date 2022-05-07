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
    },
    async createUserSurveyApply(_, payload) {
      await axios.post('/survey/user-survey/apply', payload).then((res) => {
        if (res.code === 200) {
          ElMessage.success(res.message);
        } else {
          ElMessage.error(res.message);
        }
      });
    },
    async ReviewUserSurveyApply(_, payload) {
      await axios
        .post('/survey/user-survey/apply/review', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async submitUserSurveyPlan(_, payload) {
      await axios
        .post('/survey/user-survey/plan/create', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async addActualStarttime(_, payload) {
      await axios
        .post('/survey/user-survey/start-time/add', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async approvalUserSurveyPlan(_, payload) {
      await axios
        .post('/survey/user-survey/plan/approval', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async UpdatePlanOperator(_, payload) {
      await axios
        .post('/survey/user-survey/plan-operator/update', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async confirmUserSurvey(_, payload) {
      await axios
        .post('/survey/user-survey/plan/finish', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async finishChildSurveyPlan(_, payload) {
      await axios
        .post('/survey/user-survey/child-plan/finish', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    },
    async approvalChildSurveyPlan(_, payload) {
      await axios
        .post('/survey/user-survey/child-plan/approval', payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          } else {
            ElMessage.error(res.message);
          }
        });
    }
  }
};
