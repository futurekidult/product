<template>
  <div class="select-title">
    <span class="line">|</span> 专利排查
  </div>

  <div class="apply-item">
    <div class="survey-title">
      专利排查申请表
    </div>
    <el-button> 专利排查申请 </el-button>
  </div>

  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
  >
    <el-table-column label="序号" />
    <el-table-column label="申请人" />
    <el-table-column label="提交时间" />
    <el-table-column label="评审完成时间" />
    <el-table-column label="专利类型" />
    <el-table-column label="评审状态" />
    <el-table-column label="操作" />
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
    <el-table-column label="操作" />
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
</template>

<script>
import ContractReport from '../common/contract-report.vue';
export default {
  components: {
    ContractReport
  },
  data() {
    return {
      activeName: 'contract'
    };
  }
};
</script>

<style scoped>
.patent-tabs {
  margin: 30px 0;
}
</style>
