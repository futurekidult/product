<template>
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
      label="市场调研"
      name="market"
    >
      <market-survey
        :change-color="changeColor"
        :get-list="getMarket"
        :progress="marketProgress"
        :attachment="markeAttachment"
      />
    </el-tab-pane>
    <el-tab-pane
      label="用户分析"
      name="analysis"
    >
      <user-analysis
        :get-list="getAnalysis"
        :progress="analysisProgress"
        :attachment="analysisAttachment"
        :analysis-form="analysisForm"
      />
    </el-tab-pane>
    <el-tab-pane
      label="产品方案"
      name="plan"
    >
      <product-plan
        :get-list="getPlan"
        :progress="planProgress"
        :attachment="planAttachment"
        :product-form="planForm"
      />
    </el-tab-pane>
    <el-tab-pane
      label="风险调研"
      name="risk"
    >
      <risk-survey
        :get-list="getRisk"
        :progress="riskProgress"
        :attachment="riskAttachment"
        :risk-form="riskForm"
      />
    </el-tab-pane>
    <el-tab-pane
      label="用户调研"
      name="user"
    >
      <user-survey
        :change-color="changeColor"
        :progress="userProgress"
        :button-state="buttonState"
        :survey-apply="surveyApply"
        :plan-list="planList"
        :length="length"
        :get-list="getUserSurvey"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { formatterTime } from '../../../../utils';
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
  props: ['id'],
  data() {
    return {
      activeName: 'platform',
      platformProgress: {},
      platformForm: {},
      productImages: [],
      platformAttachment: {},
      markeAttachment: {},
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
      length: 0
    };
  },
  mounted() {
    this.getPlatform();
  },
  methods: {
    async getPlatform() {
      await this.$store.dispatch('product/survey/platform/getPlatform');
      this.platformProgress =
        this.$store.state.product.survey.platform.platform.progress;
      this.platformProgress.estimated_finish_time = formatterTime(
        this.platformProgress.estimated_finish_time
      );
      this.platformProgress.actual_finish_time = formatterTime(
        this.platformProgress.actual_finish_time
      );
      this.platformForm =
        this.$store.state.product.survey.platform.platform.report;
      this.productImages = this.platformForm.images;
      this.platformAttachment = this.platformForm.attachment;
    },
    async getMarket() {
      await this.$store.dispatch('product/survey/market/getMarket');
      this.marketProgress =
        this.$store.state.product.survey.market.market.progress;
      this.marketProgress.estimated_finish_time = formatterTime(
        this.marketProgress.estimated_finish_time
      );
      this.marketProgress.actual_finish_time = formatterTime(
        this.marketProgress.actual_finish_time
      );
      this.markeAttachment =
        this.$store.state.product.survey.market.market.report;
    },
    async getAnalysis() {
      await this.$store.dispatch('product/survey/userAnalysis/getAnalysis');
      this.analysisProgress =
        this.$store.state.product.survey.userAnalysis.userAnalysis.progress;
      this.analysisProgress.estimated_finish_time = formatterTime(
        this.analysisProgress.estimated_finish_time
      );
      this.analysisProgress.actual_finish_time = formatterTime(
        this.analysisProgress.actual_finish_time
      );
      this.analysisForm =
        this.$store.state.product.survey.userAnalysis.userAnalysis.report;
      this.analysisAttachment = this.analysisForm.attachment;
    },
    async getPlan() {
      await this.$store.dispatch('product/survey/plan/getPlan');
      this.planProgress = this.$store.state.product.survey.plan.plan.progress;
      this.planProgress.estimated_finish_time = formatterTime(
        this.planProgress.estimated_finish_time
      );
      this.planProgress.actual_finish_time = formatterTime(
        this.planProgress.actual_finish_time
      );
      this.planForm = this.$store.state.product.survey.plan.plan.report;
      this.planAttachment = this.planForm.attachment;
    },
    async getRisk() {
      await this.$store.dispatch('product/survey/risk/getRisk');
      this.riskProgress = this.$store.state.product.survey.risk.risk.progress;
      this.riskProgress.estimated_finish_time = formatterTime(
        this.riskProgress.estimated_finish_time
      );
      this.riskProgress.actual_finish_time = formatterTime(
        this.riskProgress.actual_finish_time
      );
      this.riskForm = this.$store.state.product.survey.risk.risk.report;
      this.riskAttachment = this.riskForm.attachment;
    },
    async getUserSurvey() {
      await this.$store.dispatch('product/survey/user/getUserSurveyData');
      this.buttonState = this.$store.state.product.survey.user.buttonState;
      this.surveyApply = this.$store.state.product.survey.user.surveyApply;
      this.surveyApply.forEach((item) => {
        item.create_time = formatterTime(item.create_time);
        item.review_finish_time = formatterTime(item.review_finish_time);
      });
      this.userProgress = this.$store.state.product.survey.user.progress;
      this.userProgress.estimated_finish_time = formatterTime(
        this.userProgress.estimated_finish_time
      );
      this.userProgress.actual_start_time = formatterTime(
        this.userProgress.actual_start_time
      );
      this.userProgress.actual_finish_time = formatterTime(
        this.userProgress.actual_finish_time
      );
      this.planList = this.$store.state.product.survey.user.planList;
      this.planList.forEach((item) => {
        item.estimated_finish_time = formatterTime(item.estimated_finish_time);
        item.actual_finish_time = formatterTime(item.actual_finish_time);
      });
      this.length = this.$store.state.product.survey.user.planList.length;
    },
    changeColor(val) {
      if (val === 10 || val === 20) {
        return 'result-ing';
      } else if (val === 40) {
        return 'result-pass';
      } else {
        return 'result-fail';
      }
    },
    handleClick(tab) {
      switch (tab.props.name) {
        case 'platform':
          this.$store.commit(
            'product/survey/platform/setPlatformLoading',
            true
          );
          this.getPlatform();
          break;
        case 'market':
          this.$store.commit('product/survey/market/setMarketLoading', true);
          this.getMarket();
          break;
        case 'analysis':
          this.$store.commit(
            'product/survey/userAnalysis/setAnalysisLoading',
            true
          );
          this.getAnalysis();
          break;
        case 'plan':
          this.$store.commit('product/survey/plan/setPlanLoading', true);
          this.getPlan();
          break;
        case 'risk':
          this.$store.commit('product/survey/risk/setRiskLoading', true);
          this.getRisk();
          break;
        case 'user':
          this.$store.commit('product/survey/user/setUserLoading', true);
          this.getUserSurvey();
          break;
        default:
      }
    }
  }
};
</script>
