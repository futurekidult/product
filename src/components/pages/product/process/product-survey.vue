<template>
  <div class="select-title">
    <span class="line">|</span> 项目调研
  </div>

  <el-tabs
    v-model="activeName"
    type="card"
  >
    <el-tab-pane
      label="平台调研"
      name="platform"
    >
      <platform-survey />
    </el-tab-pane>
    <el-tab-pane
      label="市场调研"
      name="market"
    >
      <market-survey />
    </el-tab-pane>
    <el-tab-pane
      label="用户分析"
      name="analy"
    >
      <user-analysis />
    </el-tab-pane>
    <el-tab-pane
      label="产品方案"
      name="plan"
    >
      <product-plan />
    </el-tab-pane>
    <el-tab-pane
      label="风险调研"
      name="risk"
    >
      <risk-survey />
    </el-tab-pane>
    <el-tab-pane
      label="用户调研"
      name="user"
    >
      <user-survey />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
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
      activeName: 'market'
    };
  }
};
</script>
