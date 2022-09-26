<template>
  <div v-loading="$store.state.product.patent.patentLoading">
    <div class="select-title">
      <span class="line">|</span> 专利排查
    </div>

    <div class="apply-item">
      <div class="survey-title">
        专利排查申请表
      </div>
      <el-button
        :disabled="buttonState === 0"
        @click="showPatentForm"
      >
        专利排查申请
      </el-button>
    </div>

    <el-table
      border
      stripe
      empty-text="无数据"
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
      <el-table-column label="评审状态">
        <template #default="scope">
          <div :class="changeColor(scope.row.review_state)">
            {{ scope.row.review_state_desc }}
          </div>
        </template>
      </el-table-column>
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

    <div v-if="JSON.stringify(progress) !== '{}'">
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
          <div :class="changeColor(progress.state)">
            {{ progress.state_desc }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="操作">
          <el-button
            :disabled="progress.state !== 10"
            :class="progress.state === undefined ? 'hide' : ''"
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
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="第三方签订合同"
          name="contract"
        >
          <contract-report
            :data="contract"
            type="contract"
            :change-color="changeColor"
          />
        </el-tab-pane>
        <el-tab-pane
          label="专利排查报告"
          name="patent-report"
        >
          <contract-report
            :data="report"
            type="report"
            :get-report="getReport"
            :change-color="changeColor"
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
      :product-form="patent"
      @hide-dialog="closePatentApply"
    />

    <patent-apply
      v-if="patentReviewVisible"
      :id="applyId"
      :dialog-visible="patentReviewVisible"
      title="专利排查需求评审"
      type="review"
      :form="reviewForm"
      :product-form="patent"
      @hide-dialog="closePatentReview"
    />

    <patent-apply
      v-if="viewReviewVisible"
      :dialog-visible="viewReviewVisible"
      title="查看"
      type="view"
      :form="viewForm"
      :product-form="patent"
      @hide-dialog="closeViewReview"
    />
  </div>
</template>

<script>
import { formatterTime } from '../../../../utils';
import ContractReport from '../common/contract-report.vue';
import PatentApply from '../common/patent-apply.vue';

export default {
  components: {
    ContractReport,
    PatentApply
  },
  inject: ['getContract', 'getPatentProgress'],
  props: ['patent', 'progress', 'contract', 'applyForm'],
  data() {
    return {
      activeName: 'contract',
      patentVisible: false,
      patentReviewVisible: false,
      viewReviewVisible: false,

      reviewForm: {},
      viewForm: {},
      applyId: 0,
      report: {}
    };
  },
  computed: {
    buttonState() {
      return this.patent.button_state;
    }
  },
  methods: {
    async getReport() {
      this.$store.commit('product/patent/setReportLoading', true);
      try {
        await this.$store.dispatch('product/patent/getReport', {
          params: { product_id: this.$route.params.productId }
        });
        this.report = this.$store.state.product.patent.report;
        this.report.actual_finish_time = formatterTime(
          this.report.actual_finish_time
        );
      } catch (err) {
        this.$store.commit('product/patent/setReportLoading', false);
        return;
      }
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
      try {
        await this.$store.dispatch('product/patent/viewPatentReview', {
          params
        });
        this.applyId = id;
        this.reviewForm = this.$store.state.product.patent.singlePatent.patent;
        this.patentReviewVisible = true;
      } catch (err) {
        return;
      }
    },
    closePatentReview() {
      this.patentReviewVisible = false;
    },
    async showViewReview(id) {
      let params = {
        patent_apply_id: id
      };
      try {
        await this.$store.dispatch('product/patent/viewPatentReview', {
          params
        });
        let { singlePatent } = this.$store.state.product.patent;
        this.viewForm = singlePatent.patent;
        this.viewForm['review_result'] = singlePatent.review_result;
        this.viewReviewVisible = true;
      } catch (err) {
        return;
      }
    },
    closeViewReview() {
      this.viewReviewVisible = false;
    },
    async confirmPatent() {
      let params = {
        product_id: +this.$route.params.productId
      };
      try {
        await this.$store.dispatch('product/patent/confirmPatent', params);
        this.getPatentProgress();
      } catch (err) {
        return;
      }
    },
    changeColor(val) {
      if (val === 10) {
        return 'result-ing';
      } else if (val === 30 || val === 40) {
        return 'result-pass';
      } else {
        return 'result-fail';
      }
    },
    handleClick(tab) {
      if (tab.props.name === 'contract') {
        this.getContract();
      } else {
        this.getReport();
      }
    }
  }
};
</script>

<style scoped>
.patent-tabs {
  margin: 30px 0;
}

.hide {
  display: none;
}
</style>
