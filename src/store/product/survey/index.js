import PlatformSurvey from './platform/index.js';
import MarketSurvey from './market/index.js';
import AnalysisSurvey from './user-analysis/index.js';
import ProductPlan from './plan/index.js';
import RiskSurvey from './risk/index.js';
import UserSurvey from './user-survey/index.js';
import axios from '../../../utils/axios';
import { ElMessage } from 'element-plus';

export default {
  namespaced: true,
  modules: {
    platform: PlatformSurvey,
    market: MarketSurvey,
    userAnalysis: AnalysisSurvey,
    plan: ProductPlan,
    risk: RiskSurvey,
    user: UserSurvey
  },
  state() {
    return {
      suggestion: {},
      currentSurvey: {}
    };
  },
  mutations: {
    setSuggestion(state, payload) {
      state.suggestion = payload;
    },
    setCurrentSurvey(state, payload) {
      state.currentSurvey = payload;
    }
  },
  actions: {
    async getSurveySuggestion(context, payload) {
      await axios
        .get(`/survey/suggestion/list/${payload.type}`, payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit('setSuggestion', res.data);
          }
        });
    },
    async createSurveySuggestion(_, payload) {
      await axios
        .post(`/survey/suggestion/create/${payload.type}`, payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async updateSurveySuggestion(_, payload) {
      await axios
        .post(`/survey/suggestion/update/${payload.type}`, payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async deleteSurveySuggestion(_, payload) {
      await axios
        .post(`/survey/suggestion/delete/${payload.type}`, payload)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success(res.message);
          }
        });
    },
    async getSurveySchedule(context, payload) {
      await axios.get('/survey/schedule/get', payload).then((res) => {
        if (res.code === 200) {
          context.commit('setCurrentSurvey', res.data);
        }
      });
    }
  }
};
