<template>
  <el-tabs
    v-model="activeName"
    type="card"
    @tab-click="handleClick"
  >
    <el-tab-pane
      label="市场调研"
      name="market"
    >
      <market-survey />
    </el-tab-pane>
    <el-tab-pane
      label="平台调研"
      name="platform"
    >
      <platform-survey />
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
      <product-schema />
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
import ProductSchema from './survey/product-schema.vue';
import RiskSurvey from './survey/risk-survey.vue';
import UserSurvey from './survey/user-survey.vue';

export default {
  components: {
    MarketSurvey,
    PlatformSurvey,
    UserAnalysis,
    ProductSchema,
    RiskSurvey,
    UserSurvey
  },
  data() {
    return {
      activeName: 'market'
    };
  }
};
</script>
