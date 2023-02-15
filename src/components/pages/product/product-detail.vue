<template>
  <div>
    <router-view />
    <div v-if="isParent">
      <div
        v-loading="$store.state.product.baseLoading"
        class="border"
      >
        <div class="detail-title">
          {{ productBase.name }}
          <div class="tag-position">
            <base-tag
              :mode="mode"
              type="tag"
            >
              <span>{{ productBase.state_desc }}</span>
            </base-tag>
            <text-btn
              v-if="productBase.state === 90"
              class="terminate-btn"
              @handle-click="showViewReasonForm(productBase.termination_reason)"
            >
              查看终止原因
            </text-btn>
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
              <text-btn @handle-click="toRelatedDemand(productBase.demand_id)">
                {{ productBase.demand_id }}
              </text-btn>
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

          <div>
            <el-button
              v-if="productBase.state <= 50"
              type="danger"
              @click="showTerminateForm"
            >
              项目终止
            </el-button>
            <el-button
              v-if="productBase.state === 70"
              type="success"
              @click="showConfirmDialog"
            >
              项目完成
            </el-button>
          </div>
        </div>
      </div>

      <div
        v-loading="$store.state.product.detailLoading"
        class="border"
      >
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
              :survey-condition="surveyCondition"
            />
          </el-tab-pane>
          <el-tab-pane
            v-if="
              (productBase.state >= 20 && productBase.state !== 90) ||
                unterminated & 0b00000001000
            "
            label="项目立项"
            name="project"
          >
            <project-setup
              v-if="isGetProjectData"
              :progress="projectProgress"
              :project-form="projectForm"
              :attachment="projectAttachment"
              :meeting-attachment="meetingAttachment"
              :profit="projectProfit"
              :schedule="projectSchedule"
            />
          </el-tab-pane>
          <el-tab-pane
            v-if="getState || unterminated & 0b00000010000"
            label="定价信息"
            name="price"
          >
            <product-price
              :change-color="changeCellColor"
              :pricing-list="pricingList"
            />
          </el-tab-pane>
          <el-tab-pane
            v-if="getState || unterminated & 0b00100000000"
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
            v-if="getState || unterminated & 0b00100000000"
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
            v-if="getState || unterminated & 0b00100000000"
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
            v-if="getState || unterminated & 0b00100000000"
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
            v-if="getState || unterminated & 0b01000000000"
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
            v-if="getState || unterminated & 0b10000000000"
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

    <terminate-form
      v-if="terminateProjectVisible"
      :dialog-visible="terminateProjectVisible"
      type="create"
      :close-on-click-modal="false"
      @hide-dialog="closeTerminateForm"
    />

    <terminate-form
      v-if="viewReasonVisible"
      :dialog-visible="viewReasonVisible"
      type="view"
      :reason="reason"
      :close-on-click-modal="false"
      @hide-dialog="closeViewReasonForm"
    />

    <confirm-dialog
      v-if="confirmDialogVisible"
      :dialog-visible="confirmDialogVisible"
      :get-list="getProductBase"
      dialog-content="是否确认项目所有事项已完成"
      type="product finish"
      :close-on-click-modal="false"
      @hide-dialog="closeConfirmDialog"
    />
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
import { changeTimestamp } from '../../../utils';
import { getDemandDetail } from '../../../utils/demand';
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
      getBase: this.getProductBase,
      getSurveySchedule: this.getSurveySchedule
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
      meetingAttachment: {},
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
      packagePageSize: 10,
      confirmDialogVisible: false,
      unterminated: 0,
      surveyCondition: null
    };
  },
  computed: {
    isParent() {
      return this.$route.name !== 'order detail';
    },
    getState() {
      return this.productBase.state >= 40 && this.productBase.state !== 90;
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
      this.$store.commit('product/setBaseLoading', true);
      try {
        await this.$store.dispatch('product/getProductBase', {
          params: {
            id: +this.$route.params.productId
          }
        });
        this.productBase = this.$store.state.product.productBase;
        let unterminatedStateNum = this.productBase.unterminated_state;
        if (unterminatedStateNum !== 0) {
          this.unterminated =
            this.$global.unterminatedStateCode[unterminatedStateNum];
        }
        if (this.productBase.state === 90) {
          this.mode = 'info';
        } else if (this.productBase.state === 80) {
          this.mode = 'success';
        } else {
          this.mode = 'warning';
        }
      } catch (err) {
        this.$store.commit('product/setBaseLoading', false);
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
        let val =
          (this.productForm.is_new_category << 1) +
          this.productForm.is_new_product;
        localStorage.setItem(
          'product-position',
          JSON.stringify(this.$global.categoryProductMap[val])
        );
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
        this.meetingAttachment = this.projectForm.meeting_summary_file || {};
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
        case 'survey':
          this.getPlatform();
          this.getSurveySchedule();
          break;
        default:
      }
    },
    async getSurveySchedule() {
      try {
        await this.$store.dispatch('product/survey/getSurveySchedule', {
          params: {
            product_id: +this.$route.params.productId
          }
        });
        let { currentSurvey } = this.$store.state.product.survey;
        this.surveyCondition = parseInt(
          JSON.parse(localStorage.getItem('product-position'))[
            currentSurvey.current_survey
          ]
        );
      } catch (err) {
        return;
      }
    },
    handleClick(tab) {
      this.getRequest(tab.props.name);
    },
    toRelatedDemand(id) {
      if (this.$store.state.menuData.links.indexOf('/demand-list') > -1) {
        getDemandDetail(id, 'detail');
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
    changeCurrentPage(val, type) {
      switch (type) {
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
      switch (type) {
        case 'member':
          this.memberPageSize = val;
          this.memberCurrentPage = 1;
          this.getProjectMember();
          break;
        case 'mould':
          this.mouldPageSize = val;
          this.mouldCurrentPage = 1;
          this.getMouldList();
          break;
        case 'sample':
          this.samplePageSize = val;
          this.sampleCurrentPage = 1;
          this.getSampleList();
          break;
        case 'question':
          this.questionPageSize = val;
          this.questionCurrentPage = 1;
          this.getQuestionList();
          break;
        case 'order':
          this.orderPageSize = val;
          this.orderCurrentPage = 1;
          this.getOrderList();
          break;
        case 'package':
          this.packagePageSize = val;
          this.packageCurrentPage = 1;
          this.getPackageList();
          break;
        default:
      }
    },
    showConfirmDialog() {
      this.confirmDialogVisible = true;
    },
    closeConfirmDialog() {
      this.confirmDialogVisible = false;
    }
  }
};
</script>

<style scoped>
.terminate-btn {
  margin-left: 20px;
}
</style>
