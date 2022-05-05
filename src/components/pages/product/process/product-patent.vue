<template>
  <div class="select-title">
    <span class="line">|</span> 专利排查
  </div>

  <div class="apply-item">
    <div class="survey-title">
      专利排查申请表
    </div>
    <el-button
      :disabled="button_state === 0 ? true : false"
      @click="showPatentForm"
    >
      专利排查申请
    </el-button>
  </div>

  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    :data="patent.patent_list"
  >
    <el-table-column
      label="序号"
      type="index"
      width="60px"
    />
    <el-table-column
      label="申请人"
      prop="applicant"
    />
    <el-table-column
      label="提交时间"
      prop="submit_time"
    />
    <el-table-column
      label="评审完成时间"
      prop="review_time"
    />
    <el-table-column
      label="专利类型"
      prop="patent_types"
    />
    <el-table-column
      label="评审状态"
      prop="review_state_desc"
    />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button
          v-if="scope.row.review_state === 10"
          type="text"
          @click="showPatentReview(scope.row.id)"
        >
          专利排查需求评审
        </el-button>
        <el-button
          v-else
          type="text"
          @click="showViewReview(scope.row.id)"
        >
          查看
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <div v-if="JSON.stringify(progress) === '{}' ? false : true">
    <div class="project-title">
      专利排查进度表
    </div>

    <el-descriptions
      border
      :column="5"
      direction="vertical"
    >
      <el-descriptions-item label="专利负责人">
        {{ progress.principal }}
      </el-descriptions-item>
      <el-descriptions-item label="计划完成时间">
        {{ progress.estimated_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="实际完成时间">
        {{ progress.actual_finish_time }}
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        {{ progress.state_desc }}
      </el-descriptions-item>
      <el-descriptions-item label="操作">
        <el-button
          :disabled="progress.state === 10 ? false : true"
          @click="confirmPatent"
        >
          专利排查完成
        </el-button>
      </el-descriptions-item>
    </el-descriptions>

    <el-tabs
      v-model="activeName"
      type="card"
      class="patent-tabs"
    >
      <el-tab-pane
        label="第三方签订合同"
        name="contract"
      >
        <contract-report
          :data="contract"
          type="contract"
        />
      </el-tab-pane>
      <el-tab-pane
        label="专利排查报告"
        name="patent-report"
      >
        <contract-report
          :data="report"
          type="report"
        />
      </el-tab-pane>
    </el-tabs>
  </div>

  <patent-apply
    v-if="patentVisible"
    :dialog-visible="patentVisible"
    title="专利排查申请"
    type="apply"
    :form="applyForm"
    :competitive-product="competitiveProduct"
    @hide-dialog="closePatentApply"
  />

  <patent-apply
    v-if="patentReviewVisible"
    :id="applyId"
    :dialog-visible="patentReviewVisible"
    title="专利排查需求评审"
    type="review"
    :form="reviewForm"
    :competitive-product="competitiveProduct"
    @hide-dialog="closePatentReview"
  />

  <patent-apply
    v-if="viewReviewVisible"
    :dialog-visible="viewReviewVisible"
    title="查看"
    type="view"
    :form="viewForm"
    :competitive-product="competitiveProduct"
    @hide-dialog="closeViewReview"
  />
</template>

<script>
import ContractReport from '../common/contract-report.vue';
import PatentApply from '../common/patent-apply.vue';

export default {
  components: {
    ContractReport,
    PatentApply
  },
  data() {
    return {
      activeName: 'contract',
      patentVisible: false,
      patentReviewVisible: false,
      viewReviewVisible: false,
      button_state: null,
      applyForm: {},
      reviewForm: {},
      viewForm: {},
      applyId: 0,
      patent: {},
      progress: {},
      contract: {},
      report: {},
      competitiveProduct: []
    };
  },
  computed: {},
  mounted() {
    this.getEnum();
    this.getPatent();
    this.getProcess();
    this.getContract();
    this.getReport();
  },
  methods: {
    async getEnum() {
      await this.$store.dispatch('product/patent/getEnum');
    },
    async getPatent() {
      await this.$store.dispatch('product/patent/getPatent', {
        params: { product_id: this.$route.params.productId }
      });
      this.patent = this.$store.state.product.patent.patent;
      this.button_state = this.patent.button_state;
      this.competitiveProduct = this.patent.competitive_product;
      this.applyForm.product_name_cn =
        this.$store.state.product.patent.patent.product_name_cn;
    },
    async getProcess() {
      await this.$store.dispatch('product/patent/getProgress', {
        params: { product_id: this.$route.params.productId }
      });
      this.progress = this.$store.state.product.patent.progress;
    },
    async getContract() {
      await this.$store.dispatch('product/patent/getContract', {
        params: { product_id: this.$route.params.productId }
      });
      this.contract = this.$store.state.product.patent.contract;
    },
    async getReport() {
      await this.$store.dispatch('product/patent/getReport', {
        params: { product_id: this.$route.params.productId }
      });
      this.report = this.$store.state.product.patent.report;
    },
    async getPatentProgress() {
      let params = {
        product_id: this.$route.params.productId
      };
      await this.$store.dispatch('product/patent/getProgress', { params });
    },
    showPatentForm() {
      this.patentVisible = true;
    },
    closePatentApply() {
      this.patentVisible = false;
    },
    async showPatentReview(id) {
      let params = {
        patent_apply_id: id
      };
      await this.$store.dispatch('product/patent/viewPatentReview', { params });
      this.applyId = id;
      this.reviewForm = this.$store.state.product.patent.singlePatent.patent;
      this.patentReviewVisible = true;
    },
    closePatentReview() {
      this.patentReviewVisible = false;
    },
    async showViewReview(id) {
      let params = {
        patent_apply_id: id
      };
      await this.$store.dispatch('product/patent/viewPatentReview', { params });
      this.viewForm = this.$store.state.product.patent.singlePatent.patent;
      this.viewForm['review_result'] =
        this.$store.state.product.patent.singlePatent.review_result;
      this.viewReviewVisible = true;
    },
    closeViewReview() {
      this.viewReviewVisible = false;
    },
    async confirmPatent() {
      let params = {
        product_id: +this.$route.params.productId
      };
      await this.$store.dispatch('product/patent/confirmPatent', params);
      this.getPatentProgress();
    }
  }
};
</script>

<style scoped>
.patent-tabs {
  margin: 30px 0;
}
</style>
