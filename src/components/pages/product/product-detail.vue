<template>
  <div>
    <router-view />
    <div v-if="isParent">
      <div class="border">
        <base-tag
          mode="warning"
          type="tag"
        >
          <span v-if="status === 1">调研中</span>
          <span v-if="status === 2">立项中</span>
          <span v-if="status === 3">定价阶段</span>
          <span v-if="status === 4">样品阶段</span>
          <span v-if="status === 5">下单阶段</span>
          <span v-if="status === 6">包材阶段</span>
        </base-tag>

        <el-descriptions
          title="一款非常有潜力的太阳能灯"
          :column="4"
        >
          <el-descriptions-item>
            <template #label>
              关联需求
            </template>
            <el-button type="text">
              查看
            </el-button>
          </el-descriptions-item>
          <el-descriptions-item label="产品定位">
            老品类新产品
          </el-descriptions-item>
          <el-descriptions-item label="项目经理">
            张三
          </el-descriptions-item>
          <el-descriptions-item label="项目管理员">
            李四
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="border">
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="基本信息"
            name="basic"
          >
            <product-basic :id="id" />
          </el-tab-pane>
          <el-tab-pane
            label="项目成员"
            name="member"
          >
            <related-member />
          </el-tab-pane>
          <el-tab-pane
            label="项目调研"
            name="survey"
          >
            <product-survey :id="id" />
          </el-tab-pane>
          <el-tab-pane
            label="项目立项"
            name="plan"
          >
            <project-setup />
          </el-tab-pane>
          <el-tab-pane
            label="定价信息"
            name="price"
          >
            <product-price />
          </el-tab-pane>
          <el-tab-pane
            label="专利排查"
            name="patent"
          >
            <product-patent />
          </el-tab-pane>
          <el-tab-pane
            label="模具信息"
            name="mould"
          >
            <mould-message />
          </el-tab-pane>
          <el-tab-pane
            label="样品信息"
            name="sample"
          >
            <sample-message />
          </el-tab-pane>
          <el-tab-pane
            label="测试问题"
            name="test"
          >
            <question-all />
          </el-tab-pane>
          <el-tab-pane
            label="下单信息"
            name="order"
          >
            <product-order />
          </el-tab-pane>
          <el-tab-pane
            label="包材设计"
            name="package"
          >
            <product-package />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import ProductBasic from './process/product-basic.vue';
import RelatedMember from './process/related-member.vue';
import ProductSurvey from './process/product-survey.vue';
import ProjectSetup from './process/project-setup.vue';
import ProductPrice from './process/product-price.vue';
import ProductPatent from './process/product-patent.vue';
import SampleMessage from './process/sample-message.vue';
import MouldMessage from './process/mould-message.vue';
import QuestionAll from './process/question-all.vue';
import ProductOrder from './process/product-order.vue';
import ProductPackage from './process/product-package.vue';

export default {
  components: {
    ProductBasic,
    RelatedMember,
    ProductSurvey,
    ProjectSetup,
    ProductPrice,
    ProductPatent,
    MouldMessage,
    SampleMessage,
    QuestionAll,
    ProductOrder,
    ProductPackage
  },
  props: ['productId'],
  data() {
    return {
      status: 2,
      activeName: 'basic',
      id: 0
    };
  },
  computed: {
    isParent() {
      return this.$route.name !== 'order detail';
    }
  },
  created() {
    this.id = this.$route.params.productId;
    this.getPlatformProcess();
    this.getPlatformForm();
    this.getMarketProcess();
    this.getAnalysisProcess();
    this.getPlanData();
    this.getRiskData();
    this.getUserSurveyData();
    this.getPatent();
    this.getPatentProgress();
    this.getPatentContract();
    this.getPatentReport();
    this.getSkuForm();
    this.getOrderProgress();
    this.getContract();
    this.getProject();
    this.getProfit();
    this.getSchedule();
  },
  methods: {
    async getPlatformProcess() {
      await this.$store.dispatch('product/survey/platform/getProcessData');
    },
    async getPlatformForm() {
      await this.$store.dispatch('product/survey/platform/getPlatformData');
    },
    async getMarketProcess() {
      await this.$store.dispatch('product/survey/market/getMarketData');
    },
    async getAnalysisProcess() {
      await this.$store.dispatch('product/survey/userAnalysis/getAnalysisData');
    },
    async getPlanData() {
      await this.$store.dispatch('product/survey/plan/getPlanData');
    },
    async getRiskData() {
      await this.$store.dispatch('product/survey/risk/getRiskData');
    },
    async getUserSurveyData() {
      await this.$store.dispatch('product/survey/user/getUserSurveyData');
    },
    async getPatent() {
      let params = {
        product_id: this.$route.params.productId
      };
      await this.$store.dispatch('product/patent/getPatent', { params });
    },
    async getPatentProgress() {
      let params = {
        product_id: this.$route.params.productId
      };
      await this.$store.dispatch('product/patent/getProgress', { params });
    },
    async getPatentContract() {
      let params = {
        product_id: this.$route.params.productId
      };
      await this.$store.dispatch('product/patent/getContract', { params });
    },
    async getPatentReport() {
      let params = {
        product_id: this.$route.params.productId
      };
      await this.$store.dispatch('product/patent/getReport', { params });
    },
    async getOrder() {
      let params = {
        product_id: this.$route.params.productId,
        page_size: 10,
        current_page: 1
      };
      await this.$store.dispatch('product/order/getOrderList', { params });
    },
    async getOrderProgress() {
      await this.$store.dispatch('product/order/getProgress', {
        params: { id: this.$route.params.productId }
      });
    },
    async getSkuForm() {
      await this.$store.dispatch('product/order/getSkuForm');
    },
    async getContract() {
      await this.$store.dispatch('product/order/getContract', {
        params: {
          order_id: this.$route.params.orderId
        }
      });
    },
    async getProject() {
      await this.$store.dispatch('product/project/getProject', {
        params: { product_id: this.$route.params.productId }
      });
    },
    async getProfit() {
      await this.$store.dispatch('product/project/getProfit', {
        params: { product_id: this.$route.params.productId }
      });
    },
    async getSchedule() {
      await this.$store.dispatch('product/project/getSchedule', {
        params: { product_id: this.$route.params.productId }
      });
    },
    handleClick(tab) {
      switch (tab.props.name) {
        case 'order':
          this.getOrder();
          break;
        case 'patent':
          this.getPatent();
          this.getPatentProgress();
          this.getPatentContract();
          this.getPatentReport();
          break;
        case 'project':
          this.getProject();
          break;
        default:
      }
    }
  }
};
</script>
