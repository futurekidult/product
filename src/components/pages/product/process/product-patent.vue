<template>
  <div class="select-title">
    <span class="line">|</span> 专利排查
  </div>

  <div class="apply-item">
    <div class="survey-title">
      专利排查申请表
    </div>
    <el-button @click="showPatentForm">
      专利排查申请
    </el-button>
  </div>

  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
  >
    <el-table-column label="序号">
      <template #default="scope">
        {{ scope.$index + 1 }}
      </template>
    </el-table-column>
    <el-table-column label="申请人" />
    <el-table-column label="提交时间" />
    <el-table-column label="评审完成时间" />
    <el-table-column label="专利类型" />
    <el-table-column label="评审状态" />
    <el-table-column label="操作">
      <el-button @click="showPatentReview">
        专利排查需求评审
      </el-button>
    </el-table-column>
  </el-table>

  <div class="project-title">
    专利排查进度表
  </div>

  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
  >
    <el-table-column label="专利负责人" />
    <el-table-column label="计划完成时间" />
    <el-table-column label="实际完成时间" />
    <el-table-column label="状态" />
    <el-table-column label="操作">
      <el-button>专利排查完成</el-button>
    </el-table-column>
  </el-table>

  <el-tabs
    v-model="activeName"
    type="card"
    class="patent-tabs"
  >
    <el-tab-pane
      label="第三方签订合同"
      name="contract"
    >
      <contract-report />
    </el-tab-pane>
    <el-tab-pane
      label="专利排查报告"
      name="patent-report"
    >
      <contract-report />
    </el-tab-pane>
  </el-tabs>

  <patent-apply
    v-if="patentVisible"
    :dialog-visible="patentVisible"
    title="专利排查申请"
    type="apply"
    @hide-dialog="closePatentApply"
  />

  <patent-apply
    v-if="patentReviewVisible"
    :dialog-visible="patentReviewVisible"
    title="专利排查需求评审"
    type="review"
    @hide-dialog="closePatentReview"
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
      patentReviewVisible: false
    };
  },
  methods: {
    showPatentForm() {
      this.patentVisible = true;
    },
    closePatentApply() {
      this.patentVisible = false;
    },
    showPatentReview() {
      this.patentReviewVisible = true;
    },
    closePatentReview() {
      this.patentReviewVisible = false;
    }
  }
};
</script>

<style scoped>
.patent-tabs {
  margin: 30px 0;
}
</style>
