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
      v-if="isNewCategory"
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
      v-if="isNewCategoryProduct"
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
      v-if="isNewProduct"
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
      v-if="isNewProduct"
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
        :user-id="userSurveyPrincipalId"
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
  provide() {
    return {
      getUserSurvey: this.getUserSurvey
    };
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
      length: 0,
      isNewCategory: false,
      isNewProduct: false,
      isNewCategoryProduct: false,
      userSurveyPrincipalId: 0
    };
  },
  mounted() {
    this.getPlatform();
    this.getState();
  },
  methods: {
    async getPlatform() {
      this.$store.commit('product/survey/platform/setPlatformLoading', true);
      let params = {
        id: +this.$route.params.productId
      };
      try {
        await this.$store.dispatch('product/survey/platform/getPlatform', {
          params
        });
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
      } catch (err) {
        return;
      }
    },
    async getMarket() {
      this.$store.commit('product/survey/market/setMarketLoading', true);
      let params = {
        product_id: +this.$route.params.productId
      };
      try {
        await this.$store.dispatch('product/survey/market/getMarket', {
          params
        });
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
      } catch (err) {
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
        this.analysisProgress = userAnalysis.progress;
        this.analysisProgress.estimated_finish_time = formatterTime(
          this.analysisProgress.estimated_finish_time
        );
        this.analysisProgress.actual_finish_time = formatterTime(
          this.analysisProgress.actual_finish_time
        );
        this.analysisForm = userAnalysis.report;
        this.analysisAttachment = this.analysisForm.attachment;
      } catch (err) {
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
        this.planProgress = plan.progress;
        this.planProgress.estimated_finish_time = formatterTime(
          this.planProgress.estimated_finish_time
        );
        this.planProgress.actual_finish_time = formatterTime(
          this.planProgress.actual_finish_time
        );
        this.planForm = plan.report;
        this.planAttachment = this.planForm.attachment;
      } catch (err) {
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
        this.riskProgress = risk.progress;
        this.riskProgress.estimated_finish_time = formatterTime(
          this.riskProgress.estimated_finish_time
        );
        this.riskProgress.actual_finish_time = formatterTime(
          this.riskProgress.actual_finish_time
        );
        this.riskForm = risk.report;
        this.riskAttachment = this.riskForm.attachment;
      } catch (err) {
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
        this.userSurveyPrincipalId =
          this.$store.state.product.survey.user.userId;
        this.buttonState = userSurvey.buttonState;
        this.surveyApply = userSurvey.surveyApply;
        this.surveyApply.forEach((item) => {
          item.create_time = formatterTime(item.create_time);
          item.review_finish_time = formatterTime(item.review_finish_time);
        });
        this.userProgress = userSurvey.progress;
        this.userProgress.estimated_finish_time = formatterTime(
          this.userProgress.estimated_finish_time
        );
        this.userProgress.actual_start_time = formatterTime(
          this.userProgress.actual_start_time
        );
        this.userProgress.actual_finish_time = formatterTime(
          this.userProgress.actual_finish_time
        );
        this.planList = userSurvey.planList;
        this.planList.forEach((item) => {
          item.estimated_finish_time = formatterTime(
            item.estimated_finish_time
          );
          item.actual_finish_time = formatterTime(item.actual_finish_time);
        });
        this.length = userSurvey.planList.length;
      } catch (err) {
        return;
      }
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
    },
    getState() {
      let state = JSON.parse(localStorage.getItem('position'));
      let val = String(state.is_new_category) + String(state.is_new_product);
      if (val === '11') {
        this.isNewCategoryProduct = true;
        this.isNewCategory = true;
        this.isNewProduct = true;
      } else if (val === '10') {
        this.isNewCategory = true;
      } else if (val === '01') {
        this.isNewProduct = true;
      }
    }
  }
};
</script>
