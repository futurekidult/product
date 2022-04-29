import PlatformSurvey from './platform/index.js';
import MarketSurvey from './market/index.js';
import AnalysisSurvey from './user-analysis/index.js';
import ProductPlan from './plan/index.js';
import RiskSurvey from './risk/index.js';
import UserSurvey from './user-survey/index.js';

export default {
  namespaced: true,
  modules: {
    platform: PlatformSurvey,
    market: MarketSurvey,
    userAnalysis: AnalysisSurvey,
    plan: ProductPlan,
    risk: RiskSurvey,
    user: UserSurvey
  }
};
