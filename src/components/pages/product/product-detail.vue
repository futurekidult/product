<template>
  <div v-loading="$store.state.product.baseLoading">
    <router-view />
    <div v-if="isParent">
      <div class="border">
        <base-tag
          mode="warning"
          type="tag"
        >
          <span>{{ productBase.state_desc }}</span>
        </base-tag>

        <el-descriptions
          :title="productBase.name"
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
            {{ productBase.positioning_desc }}
          </el-descriptions-item>
          <el-descriptions-item label="项目经理">
            {{ productBase.manager_desc }}
          </el-descriptions-item>
          <el-descriptions-item label="项目管理员">
            {{ productBase.administrator_desc }}
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
            <product-basic
              :product-form="productForm"
              :attachment="productAttachment"
            />
          </el-tab-pane>
          <el-tab-pane
            label="项目成员"
            name="member"
          >
            <related-member :project-member="projectMember" />
          </el-tab-pane>
          <el-tab-pane
            label="项目调研"
            name="survey"
          >
            <product-survey />
          </el-tab-pane>
          <el-tab-pane
            v-if="productBase.state >= 20"
            label="项目立项"
            name="project"
          >
            <project-setup
              :progress="projectProgress"
              :project-form="projectForm"
              :attachment="projectAttachment"
              :profit="projectProfit"
              :schedule="projectSchedule"
            />
          </el-tab-pane>
          <el-tab-pane
            v-if="productBase.state >= 40"
            label="定价信息"
            name="price"
          >
            <product-price
              :change-color="changeCellColor"
              :pricing-list="pricingList"
            />
          </el-tab-pane>
          <el-tab-pane
            label="专利排查"
            name="patent"
          >
            <product-patent
              :patent="patent"
              :progress="patentProgress"
              :contract="patentContract"
              :apply-form="applyForm"
            />
          </el-tab-pane>
          <el-tab-pane
            v-if="productBase.state >= 40"
            label="模具信息"
            name="mould"
          >
            <mould-message
              :mould-list="mouldList"
              :all-list="allMouldList"
            />
          </el-tab-pane>
          <el-tab-pane
            v-if="productBase.state >= 40"
            label="样品信息"
            name="sample"
          >
            <sample-message :sample-list="sampleList" />
          </el-tab-pane>
          <el-tab-pane
            v-if="productBase.state >= 40"
            label="测试问题"
            name="question"
          >
            <question-all :question-list="questionList" />
          </el-tab-pane>
          <el-tab-pane
            v-if="productBase.state >= 40"
            label="下单信息"
            name="order"
          >
            <product-order :order-list="orderList" />
          </el-tab-pane>
          <el-tab-pane
            v-if="productBase.state >= 40"
            label="包材设计"
            name="package"
          >
            <product-package
              :change-color="changeCellColor"
              :package-list="packageList"
            />
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
import { formatterTime } from '../../../utils';

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
  provide() {
    return {
      getMember: this.getProjectMember,
      getPricing: this.getPricingList,
      getMould: this.getMouldList,
      getAllMould: this.getAllMouldList,
      getSample: this.getSampleList,
      getQuestion: this.getQuestionList,
      getPackage: this.getPackageList,
      getOrder: this.getOrderList,
      getProfitCalcaulation: this.getProfit,
      getProcessTable: this.getSchedule,
      getContract: this.getContract,
      getPatent: this.getPatent,
      getPatentProgress: this.getPatentProgress,
      getProject: this.getProject
    };
  },
  props: ['productId'],
  data() {
    return {
      activeName: 'basic',
      id: 0,
      productBase: {},
      productForm: {},
      productAttachment: {},
      projectMember: [],
      pricingList: [],
      mouldList: [],
      allMouldList: [],
      sampleList: [],
      questionList: [],
      packageList: [],
      orderList: [],
      projectProgress: {},
      projectForm: {},
      projectAttachment: {},
      projectProfit: {},
      projectSchedule: {},
      patent: {},
      patentProgress: {},
      patentContract: {},
      applyForm: {}
    };
  },
  computed: {
    isParent() {
      return this.$route.name !== 'order detail';
    }
  },
  mounted() {
    this.getProductBase();
    this.getProductDetail();
  },
  methods: {
    async getProductBase() {
      await this.$store.dispatch('product/getProductBase', {
        params: {
          id: +this.$route.params.productId
        }
      });
      this.productBase = this.$store.state.product.productBase;
    },
    async getProductDetail() {
      await this.$store.dispatch('product/getProductDetail', {
        params: {
          id: +this.$route.params.productId
        }
      });
      this.productForm = this.$store.state.product.productDetail;
      this.productAttachment = this.productForm.images;
    },
    async getProjectMember(currentPage = 1, pageSize = 10) {
      await this.$store.dispatch('product/getProjectMember', {
        params: {
          id: +this.$route.params.productId,
          page_size: pageSize,
          current_page: currentPage
        }
      });
      this.projectMember = this.$store.state.product.projectMember;
      this.projectMember.forEach((item) => {
        item.create_time = formatterTime(item.create_time);
      });
    },
    async getPricingList(currentPage = 1, pageSize = 10) {
      let params = {
        current_page: currentPage,
        page_size: pageSize,
        product_id: +this.$route.params.productId
      };
      await this.$store.dispatch('product/getPricingList', { params });
      this.pricingList = this.$store.state.product.pricingList;
      this.pricingList.forEach((item) => {
        item.estimated_finish_time = formatterTime(item.estimated_finish_time);
        item.first_submit_time = formatterTime(item.first_submit_time);
        item.confirm_time = formatterTime(item.confirm_time);
      });
    },
    async getMouldList(currentPage = 1, pageSize = 10) {
      let params = {
        page_size: pageSize,
        current_page: currentPage,
        product_id: +this.$route.params.productId
      };
      await this.$store.dispatch('product/getMouldList', { params });
      this.mouldList = this.$store.state.product.mouldList;
      this.mouldList.forEach((item) => {
        item.create_time = formatterTime(item.create_time);
      });
    },
    async getAllMouldList(currentPage = 1, pageSize = 10) {
      let params = {
        page_size: pageSize,
        current_page: currentPage
      };
      await this.$store.dispatch('mould/getMouldList', { params });
      this.allMouldList = this.$store.state.mould.mouldList;
      this.allMouldList.forEach((item) => {
        item.create_time = formatterTime(item.create_time);
      });
    },
    async getSampleList(currentPage = 1, pageSize = 10) {
      let params = {
        product_id: +this.$route.params.productId,
        current_page: currentPage,
        page_size: pageSize
      };
      await this.$store.dispatch('product/getSampleList', { params });
      this.sampleList = this.$store.state.product.sampleList;
      this.sampleList.forEach((item) => {
        item.estimated_finish_time = formatterTime(item.estimated_finish_time);
        item.actual_finish_time = formatterTime(item.actual_finish_time);
        item.demand_time = formatterTime(item.demand_time);
      });
    },
    async getQuestionList(currentPage = 1, pageSize = 10) {
      let params = {
        product_id: +this.$route.params.productId,
        current_page: currentPage,
        page_size: pageSize
      };
      await this.$store.dispatch('product/getQuestionList', { params });
      this.questionList = this.$store.state.product.questionList;
      this.questionList.forEach((item) => {
        item.resolve_time = formatterTime(item.resolve_time);
      });
    },
    async getPackageList(currentPage = 1, pageSize = 10) {
      let params = {
        product_id: +this.$route.params.productId,
        current_page: currentPage,
        page_size: pageSize
      };
      await this.$store.dispatch('product/getPackageList', { params });
      this.packageList = this.$store.state.product.packageList;
      this.packageList.forEach((item) => {
        item.estimated_finish_time = formatterTime(item.estimated_finish_time);
        item.actual_finish_time = formatterTime(item.actual_finish_time);
      });
    },
    async getOrderList(currentPage = 1, pageSize = 10) {
      await this.$store.dispatch('product/order/getOrderList', {
        params: {
          product_id: +this.$route.params.productId,
          current_page: currentPage,
          page_size: pageSize
        }
      });
      this.orderList = this.$store.state.product.order.orderList;
      this.orderList.forEach((item) => {
        item.estimated_finish_time = formatterTime(item.estimated_finish_time);
        item.actual_finish_time = formatterTime(item.actual_finish_time);
      });
    },
    async getProject() {
      await this.$store.dispatch('product/project/getProject', {
        params: { product_id: this.$route.params.productId }
      });
      this.projectProgress = this.$store.state.product.project.project.schedule;
      this.projectForm = this.$store.state.product.project.project.form;
      this.projectAttachment = this.projectForm.sale_plan;
      this.projectProgress.actual_finish_time = formatterTime(
        this.projectProgress.actual_finish_time
      );
    },
    async getProfit() {
      await this.$store.dispatch('product/project/getProfit', {
        params: { product_id: this.$route.params.productId }
      });
      this.projectProfit = this.$store.state.product.project.profit;
    },
    async getSchedule() {
      await this.$store.dispatch('product/project/getSchedule', {
        params: { product_id: this.$route.params.productId }
      });
      this.projectSchedule = this.$store.state.product.project.schedule;
      this.projectSchedule.list.forEach((item) => {
        item.estimated_finish_time = formatterTime(item.estimated_finish_time);
        item.actual_finish_time = formatterTime(item.actual_finish_time);
      });
    },
    async getPatent() {
      await this.$store.dispatch('product/patent/getPatent', {
        params: { product_id: this.$route.params.productId }
      });
      this.patent = this.$store.state.product.patent.patent;
      this.patent.patent_list.forEach((item) => {
        item.submit_time = formatterTime(item.submit_time);
        item.review_time = formatterTime(item.review_time);
      });
      this.applyForm.product_name_cn = this.patent.product_name_cn;
    },
    async getPatentProgress() {
      await this.$store.dispatch('product/patent/getProgress', {
        params: { product_id: +this.$route.params.productId }
      });
      this.patentProgress = this.$store.state.product.patent.progress;
      this.patentProgress.actual_finish_time = formatterTime(
        this.patentProgress.actual_finish_time
      );
      this.patentProgress.estimated_finish_time = formatterTime(
        this.patentProgress.estimated_finish_time
      );
    },
    async getContract() {
      await this.$store.dispatch('product/patent/getContract', {
        params: { product_id: this.$route.params.productId }
      });
      this.patentContract = this.$store.state.product.patent.contract;
      this.patentContract.actual_finish_time = formatterTime(
        this.patentContract.actual_finish_time
      );
    },
    changeCellColor(val) {
      if (val <= 20) {
        return 'result-ing';
      } else {
        return 'result-pass';
      }
    },
    handleClick(tab) {
      switch (tab.props.name) {
        case 'basic':
          this.$store.commit('product/setDetailLoading', true);
          this.getProductDetail();
          break;
        case 'member':
          this.$store.commit('product/setMemberLoading', true);
          this.getProjectMember();
          break;
        case 'price':
          this.$store.commit('product/setPricingLoading', true);
          this.getPricingList();
          break;
        case 'mould':
          this.$store.commit('product/setMouldLoading', true);
          this.getMouldList();
          this.getAllMouldList();
          break;
        case 'sample':
          this.$store.commit('product/setSampleLoading', true);
          this.getSampleList();
          break;
        case 'question':
          this.$store.commit('product/setQuestionLoading', true);
          this.getQuestionList();
          break;
        case 'package':
          this.$store.commit('product/setPackageLoading', true);
          this.getPackageList();
          break;
        case 'order':
          this.$store.commit('product/order/setOrderLoading', true);
          this.getOrderList();
          break;
        case 'project':
          this.$store.commit('product/project/setProjectLoading', true);
          this.getProfit();
          this.getSchedule();
          this.getProject();
          break;
        case 'patent':
          this.$store.commit('product/patent/setPatentLoading', true);
          this.getPatent();
          this.getPatentProgress();
          this.getContract();
          break;
        default:
      }
    }
  }
};
</script>
