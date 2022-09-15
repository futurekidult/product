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
      marketSuggestion: {},
      platformSuggestion: {},
      userAnalysisSuggestion: {},
      productSolutionsSuggestion: {},
      riskSuggestion: {},
      userSurveySuggestion: {},
      surveyMap: {
        market: 'Market',
        platform: 'Platform',
        'user-analysis': 'UserAnalysis',
        'product-solutions': 'ProductSolutions',
        risk: 'Risk',
        'user-survey': 'UserSurvey'
      }
    };
  },
  mutations: {
    setMarketSuggestion(state, payload) {
      state.marketSuggestion = payload;
    },
    setPlatformSuggestion(state, payload) {
      state.platformSuggestion = payload;
    },
    setUserAnalysisSuggestion(state, payload) {
      state.userAnalysisSuggestion = payload;
    },
    setProductSolutionsSuggestion(state, payload) {
      state.productSolutionsSuggestion = payload;
    },
    setRiskSuggestion(state, payload) {
      state.riskSuggestion = payload;
    },
    setUserSurveySuggestion(state, payload) {
      state.userSurveySuggestion = payload;
    }
  },
  actions: {
    async getSurveySuggestion(context, payload) {
      await axios
        .get(`/survey/suggestion/list/${payload.type}`, payload)
        .then((res) => {
          if (res.code === 200) {
            context.commit(
              `set${context.state.surveyMap[payload.type]}Suggestion`,
              res.data
            );
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
    }
  }
};
