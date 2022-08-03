<template>
  <div v-loading="$store.state.product.baseLoading">
    <router-view />
    <div v-if="isParent">
      <div class="border">
        <div class="detail-title">
          {{ productBase.name }}  
          <div class="tag-position">
            <base-tag
              :mode="mode"
              type="tag"
            >
              <span>{{ productBase.state_desc }}</span>
            </base-tag>
            <el-button
              v-if="productBase.state === 90"
              type="text"
              class="terminate-btn"
              @click="showViewReasonForm(productBase.termination_reason)"
            >
              查看终止原因
            </el-button>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between">
          <el-descriptions
            :column="5"
            style="width: 80%"
          >
            <el-descriptions-item
              v-if="productBase.state === 90"
              label="产品ID:"
            >
              {{ productBase.id }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                关联需求ID:
              </template>
              <el-button
                type="text"
                @click="toRelatedDemand(productBase.demand_id)"
              >
                {{ productBase.demand_id }}
              </el-button>
            </el-descriptions-item>
            <el-descriptions-item label="产品定位:">
              {{ productBase.positioning_desc }}
            </el-descriptions-item>
            <el-descriptions-item label="项目经理:">
              {{ productBase.manager_desc }}
            </el-descriptions-item>
            <el-descriptions-item label="项目管理员:">
              {{ productBase.administrator_desc }}
            </el-descriptions-item>
          </el-descriptions>

          <el-button
            :disabled="productBase.state === 90"
            type="danger"
            @click="showTerminateForm"
          >
            终止项目
          </el-button>
        </div>
      </div>

      <div class="border">
        <el-tabs
          v-model="$store.state.activeTab"
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
            <related-member 
              :project-member="projectMember"
              :current-page="memberCurrentPage"
              :page-size="memberPageSize"
              @change-page="(val) => changeCurrentPage(val, 'member')"
              @change-size="(val) => changePageSize(val, 'member')"
            />
          </el-tab-pane>
          <el-tab-pane
            label="项目调研"
            name="survey"
          >
            <product-survey  
              v-if="isGetData"
              :platform-progress="platformProgress"
              :platform-form="platformForm"
              :product-images="productImages"
              :platform-attachment="platformAttachment"
              :is-new-category="isNewCategory"
              :is-new-product="isNewProduct"
              :is-new-category-product="isNewCategoryProduct"
            />
          </el-tab-pane>
          <el-tab-pane
            v-if="productBase.state >= 20"
            label="项目立项"
            name="project"
          >
            <project-setup
              v-if="isGetProjectData"
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
            v-if="productBase.state >= 40"
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
              :current-page="mouldCurrentPage"
              :page-size="mouldPageSize"
              @change-page="(val) => changeCurrentPage(val, 'mould')"
              @change-size="(val) => changePageSize(val, 'mould')"
            />
          </el-tab-pane>
          <el-tab-pane
            v-if="productBase.state >= 40"
            label="样品信息"
            name="sample"
          >
            <sample-message 
              :sample-list="sampleList" 
              :current-page="sampleCurrentPage"
              :page-size="samplePageSize"
              @change-page="(val) => changeCurrentPage(val, 'sample')"
              @change-size="(val) => changePageSize(val, 'sample')"
            />
          </el-tab-pane>
          <el-tab-pane
            v-if="productBase.state >= 40"
            label="测试问题"
            name="question"
          >
            <question-all 
              :question-list="questionList"
              :current-page="questionCurrentPage"
              :page-size="questionPageSize"
              @change-page="changeCurrentPage"
              @change-size="changePageSize"
            />
          </el-tab-pane>
          <el-tab-pane
            v-if="productBase.state >= 40"
            label="下单信息"
            name="order"
          >
            <product-order 
              :order-list="orderList" 
              :current-page="orderCurrentPage"
              :page-size="orderPageSize"
              @change-page="(val) => changeCurrentPage(val, 'order')"
              @change-size="(val) => changePageSize(val, 'order')"
            />
          </el-tab-pane>
          <el-tab-pane
            v-if="productBase.state >= 40"
            label="包材设计"
            name="package"
          >
            <product-package
              :change-color="changeCellColor"
              :package-list="packageList"
              :current-page="packageCurrentPage"
              :page-size="packagePageSize"
              @change-page="(val) => changeCurrentPage(val, 'package')"
              @change-size="(val) => changePageSize(val, 'package')"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>

  <terminate-form
    v-if="terminateProjectVisible"
    :dialog-visible="terminateProjectVisible"
    type="create"
    @hide-dialog="closeTerminateForm"
  />
  <terminate-form
    v-if="viewReasonVisible"
    :dialog-visible="viewReasonVisible"
    type="view"
    :reason="reason"
    @hide-dialog="closeViewReasonForm"
  />
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
import { changeTimestamp } from '../../../utils';
import TerminateForm from './common/terminate-form.vue';

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
    ProductPackage,
    TerminateForm
  },
  provide() {
    return {
      getMember: this.getProjectMember,
      getPricing: this.getPricingList,
      getMould: this.getMouldList,
      getSample: this.getSampleList,
      getQuestion: this.getQuestionList,
      getPackage: this.getPackageList,
      getOrder: this.getOrderList,
      getProfitCalcaulation: this.getProfit,
      getProcessTable: this.getSchedule,
      getContract: this.getContract,
      getPatent: this.getPatent,
      getPatentProgress: this.getPatentProgress,
      getPatentContract: this.getContract,
      getProject: this.getProject,
      getPlatform: this.getPlatform,
      getBase: this.getProductBase
    };
  },
  props: ['productId', 'orderId'],
  data() {
    return {
      id: 0,
      productBase: {},
      productForm: {},
      productAttachment: {},
      projectMember: [],
      pricingList: [],
      mouldList: [],
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
      applyForm: {},
      terminateProjectVisible: false,
      viewReasonVisible: false,
      reason: '',
      mode: '',
      platformProgress: {},
      platformForm: {},
      productImages: [],
      platformAttachment: {},
      isNewCategory: false,
      isNewProduct: false,
      isNewCategoryProduct: false,
      isGetData: false,
      isGetProjectData: false,
      memberCurrentPage: 1,
      memberPageSize: 10,
      mouldCurrentPage: 1,
      mouldPageSize: 10,
      sampleCurrentPage: 1,
      samplePageSize: 10,
      questionCurrentPage: 1,
      questionPageSize: 10,
      orderCurrentPage: 1,
      orderPageSize: 10,
      packageCurrentPage: 1,
      packagePageSize: 10

    };
  },
  computed: {
    isParent() {
      return this.$route.name !== 'order detail';
    }
  },
  mounted() {
    this.getProductBase();
    if (this.$store.state.entry !== 'workbench') {
      this.$store.commit('setActiveTab', 'basic');
    } else {
      this.getProductDetail();
    }
    this.getRequest(this.$store.state.activeTab);
  },
  methods: {
    async getProductBase() {
      try {
        await this.$store.dispatch('product/getProductBase', {
          params: {
            id: +this.$route.params.productId
          }
        });
        this.productBase = this.$store.state.product.productBase;
        if (this.productBase.state === 90) {
          this.mode = 'info';
        } else if (this.productBase.state === 80) {
          this.mode = 'success';
        } else {
          this.mode = 'warning';
        }
      } catch (err) {
        return;
      }
    },
    async getProductDetail() {
      this.$store.commit('product/setDetailLoading', true);
      try {
        await this.$store.dispatch('product/getProductDetail', {
          params: {
            id: +this.$route.params.productId
          }
        });
        this.productForm = this.$store.state.product.productDetail;
        this.productAttachment = this.productForm.images;
        let val = String(this.productForm.is_new_category) + String(this.productForm.is_new_product);
        if (val === '11') {
          this.isNewCategoryProduct = true;
          this.isNewCategory = true;
          this.isNewProduct = true;
        } else if (val === '10') {
          this.isNewCategory = true;
        } else if (val === '01') {
          this.isNewProduct = true;
        }
      } catch (err) {
        this.$store.commit('product/setDetailLoading', false);
        return;
      }
    },
    async getProjectMember() {
      this.$store.commit('product/setMemberLoading', true);
      try {
        await this.$store.dispatch('product/getProjectMember', {
          params: {
            id: +this.$route.params.productId,
            page_size: this.memberPageSize,
            current_page: this.memberCurrentPage
          }
        });
        this.projectMember = this.$store.state.product.projectMember;
        this.projectMember.forEach((item) => {
          changeTimestamp(item, 'create_time');
        });
      } catch (err) {
        this.$store.commit('product/setMemberLoading', false);
        return;
      }
    },
    async getPricingList() {
      this.$store.commit('product/setPricingLoading', true);
      let params = {
        product_id: +this.$route.params.productId
      };
      try {
        await this.$store.dispatch('product/getPricingList', { params });
        this.pricingList = this.$store.state.product.pricingList;
        this.pricingList.forEach((item) => {
          changeTimestamp(item, 'estimated_finish_time');
          changeTimestamp(item, 'first_submit_time');
          changeTimestamp(item, 'confirm_time');
        });
      } catch (err) {
        this.$store.commit('product/setPricingLoading', false);
        return;
      }
    },
    async getMouldList() {
      this.$store.commit('product/setMouldLoading', true);
      let params = {
        page_size: this.mouldPageSize,
        current_page: this.mouldCurrentPage,
        product_id: +this.$route.params.productId
      };
      try {
        await this.$store.dispatch('product/getMouldList', { params });
        this.mouldList = this.$store.state.product.mouldList;
        this.mouldList.forEach((item) => {
          changeTimestamp(item, 'create_time');
        });
      } catch (err) {
        this.$store.commit('product/setMouldLoading', false);
        return;
      }
    },
    async getSampleList() {
      this.$store.commit('product/setSampleLoading', true);
      let params = {
        product_id: +this.$route.params.productId,
        current_page: this.sampleCurrentPage,
        page_size: this.samplePageSize
      };
      try {
        await this.$store.dispatch('product/getSampleList', { params });
        this.sampleList = this.$store.state.product.sampleList;
        this.sampleList.forEach((item) => {
          changeTimestamp(item, 'estimated_finish_time');
          changeTimestamp(item, 'actual_finish_time');
          changeTimestamp(item, 'demand_time');
        });
      } catch (err) {
        this.$store.commit('product/setSampleLoading', false);
        return;
      }
    },
    async getQuestionList() {
      this.$store.commit('product/setQuestionLoading', true);
      let params = {
        product_id: +this.$route.params.productId,
        current_page: this.questionCurrentPage,
        page_size: this.questionPageSize
      };
      try {
        await this.$store.dispatch('product/getQuestionList', { params });
        this.questionList = this.$store.state.product.questionList;
        this.questionList.forEach((item) => {
          changeTimestamp(item, 'resolve_time');
          changeTimestamp(item, 'record_time');
        });
      } catch (err) {
        this.$store.commit('product/setQuestionLoading', false);
        return;
      }
    },
    async getPackageList() {
      this.$store.commit('product/setPackageLoading', true);
      let params = {
        product_id: +this.$route.params.productId,
        current_page: this.packageCurrentPage,
        page_size: this.packagePageSize
      };
      try {
        await this.$store.dispatch('product/getPackageList', { params });
        this.packageList = this.$store.state.product.packageList;
        this.packageList.forEach((item) => {
          changeTimestamp(item, 'estimated_finish_time');
          changeTimestamp(item, 'actual_finish_time');
        });
      } catch (err) {
        this.$store.commit('product/setPackageLoading', false);
        return;
      }
    },
    async getOrderList() {
      this.$store.commit('product/order/setOrderLoading', true);
      try {
        await this.$store.dispatch('product/order/getOrderList', {
          params: {
            product_id: +this.$route.params.productId,
            current_page: this.orderCurrentPage,
            page_size: this.orderPageSize
          }
        });
        this.orderList = this.$store.state.product.order.orderList;
        this.orderList.forEach((item) => {
          changeTimestamp(item, 'estimated_finish_time');
          changeTimestamp(item, 'actual_finish_time');
          item.final_price = `￥${item.final_price}`;
        });
      } catch (err) {
        this.$store.commit('product/order/setOrderLoading', false);
        return;
      }
    },
    async getProject() {
      this.$store.commit('product/project/setProjectLoading', true);
      try {
        await this.$store.dispatch('product/project/getProject', {
          params: { product_id: this.$route.params.productId }
        });
        let { project } = this.$store.state.product.project;
        this.projectProgress = project.schedule || {};
        this.projectForm = project.form || {};
        this.projectAttachment = this.projectForm.sales_plan || {};
        changeTimestamp(this.projectProgress, 'actual_finish_time');
        this.isGetProjectData = true;
      } catch (err) {
        this.$store.commit('product/project/setProjectLoading', false);
        return;
      }
    },
    async getProfit() {
      try {
        await this.$store.dispatch('product/project/getProfit', {
          params: { product_id: this.$route.params.productId }
        });
        this.projectProfit = this.$store.state.product.project.profit;
      } catch (err) {
        return;
      }
    },
    async getSchedule() {
      try {
        await this.$store.dispatch('product/project/getSchedule', {
          params: { product_id: this.$route.params.productId }
        });
        this.projectSchedule = this.$store.state.product.project.schedule;
        this.projectSchedule.list.forEach((item) => {
          changeTimestamp(item, 'estimated_finish_time');
          changeTimestamp(item, 'actual_finish_time');
        });
      } catch (err) {
        return;
      }
    },
    async getPatent() {
      this.$store.commit('product/patent/setPatentLoading', true);
      try {
        await this.$store.dispatch('product/patent/getPatent', {
          params: { product_id: this.$route.params.productId }
        });
        this.patent = this.$store.state.product.patent.patent;
        this.patent.patent_list.forEach((item) => {
          changeTimestamp(item, 'submit_time');
          changeTimestamp(item, 'review_time');
        });
        this.applyForm.product_name_cn = this.patent.product_name_cn;
      } catch (err) {
        this.$store.commit('product/patent/setPatentLoading', false);
        return;
      }
    },
    async getPatentProgress() {
      try {
        await this.$store.dispatch('product/patent/getProgress', {
          params: { product_id: +this.$route.params.productId }
        });
        this.patentProgress = this.$store.state.product.patent.progress;
        changeTimestamp(this.patentProgress, 'actual_finish_time');
        changeTimestamp(this.patentProgress, 'estimated_finish_time');
      } catch (err) {
        return;
      }
    },
    async getContract() {
      this.$store.commit('product/patent/setContractLoading', true);
      try {
        await this.$store.dispatch('product/patent/getContract', {
          params: { product_id: this.$route.params.productId }
        });
        this.patentContract = this.$store.state.product.patent.contract;
        changeTimestamp(this.patentContract, 'actual_finish_time');
      } catch (err) {
        this.$store.commit('product/patent/setContractLoading', false);
        return;
      }
    },
    async getPlatform() {
      this.$store.commit('product/survey/platform/setPlatformLoading', true);
      let params = {
        id: +this.$route.params.productId
      };
      try {
        await this.$store.dispatch('product/survey/platform/getPlatform', {
          params
        });
        let { platform } = this.$store.state.product.survey.platform;
        this.platformProgress = platform.progress || {};
        this.platformForm = platform.report || {};
        this.productImages = this.platformForm.images || [];
        this.platformAttachment = this.platformForm.attachment || {};
        changeTimestamp(this.platformProgress, 'estimated_finish_time');
        changeTimestamp(this.platformProgress, 'actual_finish_time');
        this.isGetData = true;
      } catch (err) {
        this.$store.commit('product/survey/platform/setPlatformLoading', false);
        return;
      }
    },
    changeCellColor(val) {
      if (val <= 20) {
        return 'result-ing';
      } else {
        return 'result-pass';
      }
    },
    getRequest(val) {
      switch (val) {
        case 'basic':
          this.getProductDetail();
          break;
        case 'member':
          this.memberCurrentPage = 1;
          this.memberPageSize = 10;
          this.getProjectMember();
          break;
        case 'price':
          this.getPricingList();
          this.getProductBase();
          break;
        case 'mould':
          this.mouldCurrentPage = 1;
          this.mouldPageSize = 10;
          this.getMouldList();
          this.getProductBase();
          break;
        case 'sample':
          this.sampleCurrentPage = 1;
          this.samplePageSize = 10;
          this.getSampleList();
          this.getProductBase();
          break;
        case 'question':
          this.questionCurrentPage = 1;
          this.questionPageSize = 10;
          this.getQuestionList();
          this.getProductBase();
          break;
        case 'package':
          this.packageCurrentPage = 1;
          this.packagePageSize = 10;
          this.getPackageList();
          this.getProductBase();
          break;
        case 'order':
          this.orderCurrentPage = 1;
          this.orderPageSize = 10;
          this.getOrderList();
          this.getProductBase();
          break;
        case 'project':
          this.getProfit();
          this.getSchedule();
          this.getProject();
          break;
        case 'patent':
          this.getPatent();
          this.getPatentProgress();
          this.getContract();
          this.getProductBase();
          break;
        case'survey':
          this.getPlatform(); 
          break;
        default:
      }
    },
    handleClick(tab) {
      this.getRequest(tab.props.name);
    },
    toRelatedDemand(id) {
      if(this.$store.state.menuData.links.indexOf('/demand-list') > -1) {
        this.$router.push(`/demand-list/${id}`);
      } else {
        this.$message.error('无权限访问');
      }
    },
    showTerminateForm() {
      this.terminateProjectVisible = true;
    },
    closeTerminateForm() {
      this.terminateProjectVisible = false;
    },
    showViewReasonForm(reason) {
      this.viewReasonVisible = true;
      this.reason = reason;
    },
    closeViewReasonForm() {
      this.viewReasonVisible = false;
    },
    changeCurrentPage(val,type) {
      switch(type) {
        case 'member':   
          this.memberCurrentPage = val;
          this.getProjectMember();
          break;
        case 'mould':   
          this.mouldCurrentPage = val;
          this.getMouldList();
          break;
        case 'sample':   
          this.sampleCurrentPage = val;
          this.getSampleList();
          break;
        case 'question':   
          this.questionCurrentPage = val;
          this.getQuestionList();
          break;
        case 'order':   
          this.orderCurrentPage = val;
          this.getOrderList();
          break;
        case 'package':   
          this.packageCurrentPage = val;
          this.getPackageList();
          break;
        default:
      }
    },
    changePageSize(val, type) {
      switch(type) {
        case 'member':   
          this.memberPageSize = val;
          this.getProjectMember();
          break;
        case 'mould':   
          this.mouldPageSize = val;
          this.getMouldList();
          break;
        case 'sample':   
          this.samplePageSize = val;
          this.getSampleList();
          break;
        case 'question':   
          this.questionPageSize = val;
          this.getQuestionList();
          break;
        case 'order':   
          this.orderPageSize = val;
          this.getOrderList();
          break;
        case 'package':   
          this.packagePageSize = val;
          this.getPackageList();
          break;
        default:
      }
    }
  }
};
</script>

<style scoped>
.terminate-btn {
  margin-left: 20px;
}
</style>
