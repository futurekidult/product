<template>
  <div class="apply-item">
    <div class="survey-title">
      调研申请表
    </div>
    <el-button @click="showApplyForm">
      用户调研申请
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
    <el-table-column label="评审状态" />
    <el-table-column label="操作">
      <el-button type="text">
        用户调研需求评审
      </el-button>
    </el-table-column>
  </el-table>

  <div class="survey-title">
    调研进度表
  </div>

  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
  >
    <el-table-column label="调研负责人" />
    <el-table-column label="计划完成时间" />
    <el-table-column label="实际调研开始时间" />
    <el-table-column label="实际完成时间" />
    <el-table-column label="状态" />
    <el-table-column label="操作" />
  </el-table>

  <div class="survey-title">
    用户调研计划表
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
    <el-table-column label="事项" />
    <el-table-column label="细节内容" />
    <el-table-column label="执行人" />
    <el-table-column label="计划完成时间" />
    <el-table-column label="实际完成时间" />
    <el-table-column label="状态" />
    <el-table-column label="结果附件" />
    <el-table-column label="是否审批环节" />
    <el-table-column label="操作" />
  </el-table>

  <survey-form
    v-if="isVisible"
    :dialog-visible="isVisible"
    form-title="需求申请"
    @hide-dialog="closeApplyForm"
  />
</template>

<script>
import SurveyForm from '../../common/survey-form.vue';
export default {
  components: {
    SurveyForm
  },
  data() {
    return {
      isVisible: false
    };
  },
  methods: {
    showApplyForm() {
      this.isVisible = true;
    },
    closeApplyForm() {
      this.isVisible = false;
    }
  }
};
</script>
