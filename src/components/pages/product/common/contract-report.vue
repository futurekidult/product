<template>
  <el-descriptions
    border
    :column="5"
    direction="vertical"
  >
    <el-descriptions-item label="任务负责人" />
    <el-descriptions-item label="实际完成时间" />
    <el-descriptions-item label="结果附件">
      <el-button type="text">
        下载
      </el-button>
      <span class="table-btn">|</span>
      <el-button type="text">
        预览
      </el-button>
    </el-descriptions-item>
    <el-descriptions-item label="状态" />
    <el-descriptions-item label="操作">
      <el-button>完成 </el-button>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>
