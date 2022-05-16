<template>
  <el-descriptions
    border
    :column="4"
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
      <div :class="changeColor(getProgress.state)">
        {{ getProgress.state_desc }}
      </div>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
export default {
  props: ['getProgress'],
  methods: {
    changeColor(val) {
      if (val === 10 || val === 20) {
        return 'result-ing';
      } else if (val === 40) {
        return 'result-pass';
      } else {
        return 'result-fail';
      }
    }
  }
};
</script>
