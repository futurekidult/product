<template>
  <div>
    <div class="select-title">
      <span class="line">|</span> 项目调研
    </div>

    <el-tabs
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="平台调研"
        name="platform"
      >
        <platform-survey
          :change-color="changeColor"
          :progress="platformProgress"
          :survey-form="platformForm"
          :attachment="platformAttachment"
          :product-images="productImages"
          :get-list="getPlatform"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="surveyCondition & 0b000010"
        label="市场调研"
        name="market"
      >
        <market-survey
          v-if="isGetMarketData"
          :change-color="changeColor"
          :get-list="getMarket"
          :progress="marketProgress"
          :attachment="marketAttachment"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="surveyCondition & 0b000100"
        label="用户分析"
        name="analysis"
      >
        <user-analysis
          v-if="isGetAnalysisData"
          :get-list="getAnalysis"
          :progress="analysisProgress"
          :attachment="analysisAttachment"
          :analysis-form="analysisForm"
          :scenario-visible="scenarioVisible"
          :country-visible="countryVisible"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="surveyCondition & 0b001000"
        label="产品方案"
        name="plan"
      >
        <product-plan
          v-if="isGetPlanData"
          :get-list="getPlan"
          :progress="planProgress"
          :attachment="planAttachment"
          :product-form="planForm"
          :scenario-visible="planScenarioVisible"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="surveyCondition & 0b010000"
        label="风险调研"
        name="risk"
      >
        <risk-survey
          v-if="isGetRiskData"
          :get-list="getRisk"
          :progress="riskProgress"
          :attachment="riskAttachment"
          :risk-form="riskForm"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="surveyCondition & 0b100000"
        label="用户调研"
        name="user"
      >
        <user-survey
          :progress="userProgress"
          :button-state="buttonState"
          :survey-apply="surveyApply"
          :plan-list="planList"
          :length="length"
          :get-list="getUserSurvey"
          :user-id="userSurveyPrincipalId"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { changeTimestamp } from '../../../../utils';
import MarketSurvey from './survey/market-survey.vue';
import PlatformSurvey from './survey/platform-survey.vue';
import UserAnalysis from './survey/user-analysis.vue';
import ProductPlan from './survey/product-plan.vue';
import RiskSurvey from './survey/risk-survey.vue';
import UserSurvey from './survey/user-survey.vue';

export default {
  components: {
    MarketSurvey,
    PlatformSurvey,
    UserAnalysis,
    ProductPlan,
    RiskSurvey,
    UserSurvey
  },
  inject: ['getPlatform'],
  provide() {
    return {
      getUserSurvey: this.getUserSurvey
    };
  },
  props: [
    'id',
    'platformProgress',
    'platformForm',
    'productImages',
    'platformAttachment',
    'surveyCondition'
  ],
  data() {
    return {
      activeName: 'platform',
      marketAttachment: {},
      marketProgress: {},
      analysisProgress: {},
      analysisForm: {},
      analysisAttachment: {},
      planProgress: {},
      planForm: {},
      planAttachment: {},
      riskProgress: {},
      riskForm: {},
      riskAttachment: {},
      buttonState: {},
      planList: [],
      userProgress: {},
      surveyApply: [],
      length: 0,
      userSurveyPrincipalId: 0,
      isGetMarketData: false,
      isGetAnalysisData: false,
      isGetPlanData: false,
      isGetRiskData: false,
      countryVisible: false,
      scenarioVisible: false,
      planScenarioVisible: false
    };
  },
  methods: {
    async getMarket() {
      this.$store.commit('product/survey/market/setMarketLoading', true);
      let params = {
        product_id: +this.$route.params.productId
      };
      try {
        await this.$store.dispatch('product/survey/market/getMarket', {
          params
        });
        let { market } = this.$store.state.product.survey.market;
        this.marketProgress = market.progress || {};
        this.marketAttachment = market.report || {};
        changeTimestamp(this.marketProgress, 'estimated_finish_time');
        changeTimestamp(this.marketProgress, 'actual_finish_time');
        this.isGetMarketData = true;
      } catch (err) {
        this.$store.commit('product/survey/market/setMarketLoading', false);
        return;
      }
    },
    async getAnalysis() {
      this.$store.commit(
        'product/survey/userAnalysis/setAnalysisLoading',
        true
      );
      let params = {
        id: +this.$route.params.productId
      };
      try {
        await this.$store.dispatch('product/survey/userAnalysis/getAnalysis', {
          params
        });
        let { userAnalysis } = this.$store.state.product.survey.userAnalysis;
        this.analysisProgress = userAnalysis.progress || {};
        changeTimestamp(this.analysisProgress, 'estimated_finish_time');
        changeTimestamp(this.analysisProgress, 'actual_finish_time');
        this.analysisForm = userAnalysis.report || {};
        this.analysisAttachment = this.analysisForm.attachment || {};
        this.analysisForm.usage_scenario =
          this.analysisForm.usage_scenario || [];
        if (this.analysisForm.usage_scenario.length === 0) {
          this.analysisForm.usage_scenario.push('');
          this.scenarioVisible = false;
        } else {
          this.scenarioVisible = true;
        }
        this.analysisForm.country = this.analysisForm.country || [];
        if (this.analysisForm.country.length === 0) {
          this.analysisForm.country.push({});
          this.countryVisible = false;
        } else {
          this.countryVisible = true;
        }
        this.isGetAnalysisData = true;
      } catch (err) {
        this.$store.commit(
          'product/survey/userAnalysis/setAnalysisLoading',
          false
        );
        return;
      }
    },
    async getPlan() {
      this.$store.commit('product/survey/plan/setPlanLoading', true);
      let params = {
        id: +this.$route.params.productId
      };
      try {
        await this.$store.dispatch('product/survey/plan/getPlan', { params });
        let { plan } = this.$store.state.product.survey.plan;
        this.planProgress = plan.progress || {};
        changeTimestamp(this.planProgress, 'estimated_finish_time');
        changeTimestamp(this.planProgress, 'actual_finish_time');
        this.planForm = plan.report || {};
        this.planAttachment = this.planForm.attachment || [];
        this.planForm.usage_scenario = this.planForm.usage_scenario || [];
        if (this.planForm.usage_scenario.length === 0) {
          this.planForm.usage_scenario.push([]);
          this.planScenarioVisible = false;
        } else {
          this.planScenarioVisible = true;
        }
        this.isGetPlanData = true;
      } catch (err) {
        this.$store.commit('product/survey/plan/setPlanLoading', false);
        return;
      }
    },
    async getRisk() {
      this.$store.commit('product/survey/risk/setRiskLoading', true);
      let params = {
        id: +this.$route.params.productId
      };
      try {
        await this.$store.dispatch('product/survey/risk/getRisk', { params });
        let { risk } = this.$store.state.product.survey.risk;
        this.riskProgress = risk.progress || {};
        changeTimestamp(this.riskProgress, 'estimated_finish_time');
        changeTimestamp(this.riskProgress, 'actual_finish_time');
        this.riskForm = risk.report || {};
        this.riskAttachment = this.riskForm.attachment || {};
        this.isGetRiskData = true;
      } catch (err) {
        this.$store.commit('product/survey/risk/setRiskLoading', false);
        return;
      }
    },
    async getUserSurvey() {
      this.$store.commit('product/survey/user/setUserLoading', true);
      let params = {
        id: +this.$route.params.productId
      };
      try {
        await this.$store.dispatch('product/survey/user/getUserSurveyData', {
          params
        });
        let userSurvey = this.$store.state.product.survey.user;
        this.userSurveyPrincipalId = userSurvey.userId;
        this.buttonState = userSurvey.buttonState || {};
        this.surveyApply = userSurvey.surveyApply || [];
        this.userProgress = userSurvey.progress || {};
        this.planList = userSurvey.planList || [];
        this.surveyApply.forEach((item) => {
          changeTimestamp(item, 'create_time');
          changeTimestamp(item, 'review_finish_time');
        });
        changeTimestamp(this.userProgress, 'estimated_finish_time');
        changeTimestamp(this.userProgress, 'actual_start_time');
        changeTimestamp(this.userProgress, 'actual_finish_time');
        this.planList.forEach((item) => {
          changeTimestamp(item, 'estimated_finish_time');
          changeTimestamp(item, 'actual_finish_time');
        });
        this.length = userSurvey.planList.length;
      } catch (err) {
        this.$store.commit('product/survey/user/setUserLoading', false);
        return;
      }
    },
    changeColor(val) {
      if (val === 10 || val === 20) {
        return 'result-ing';
      } else if (val === 50) {
        return 'result-pass';
      } else {
        return 'result-fail';
      }
    },
    handleClick(tab) {
      switch (tab.props.name) {
        case 'platform':
          this.getPlatform();
          break;
        case 'market':
          this.getMarket();
          break;
        case 'analysis':
          this.getAnalysis();
          break;
        case 'plan':
          this.getPlan();
          break;
        case 'risk':
          this.getRisk();
          break;
        case 'user':
          this.getUserSurvey();
          break;
        default:
      }
    }
  }
};
</script>
