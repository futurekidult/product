<template>
  <el-descriptions
    border
    :column="type === 'plan' ? 5 : 4"
    direction="vertical"
  >
    <el-descriptions-item label="调研负责人">
      {{ getProgress.principal_desc }}
    </el-descriptions-item>
    <el-descriptions-item label="计划完成时间">
      {{ getProgress.estimated_finish_time }}
    </el-descriptions-item>
    <el-descriptions-item label="实际完成时间">
      {{ getProgress.actual_finish_time }}
    </el-descriptions-item>
    <el-descriptions-item label="状态">
      <div :class="setSurveyScheduleStateColor(getProgress.state)">
        {{ getProgress.state_desc }}
      </div>
    </el-descriptions-item>
    <el-descriptions-item
      v-if="type === 'plan' && getProgress.state === 20"
      label="操作"
      width="240px"
    >
      <el-button
        class="close-btn"
        @click="approvalPlan(0)"
      >
        不通过
      </el-button>
      <el-button
        type="success"
        @click="approvalPlan(1)"
      >
        通过
      </el-button>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
import { setSurveyScheduleStateColor } from '../../../../utils/index.js';

export default {
  props: ['getProgress', 'type', 'id'],
  emits: ['refresh-plan'],
  methods: {
    setSurveyScheduleStateColor,
    async approvalPlan(val) {
      let body = {
        id: this.id,
        approval_result: val
      };
      try {
        await this.$store.dispatch('product/survey/plan/approvalPlan', body);
        this.$emit('refresh-plan', val);
      } catch (err) {
        return;
      }
    }
  }
};
</script>
