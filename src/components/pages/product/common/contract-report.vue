<template>
  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
  >
    <el-table-column label="任务负责人" />
    <el-table-column label="实际完成时间" />
    <el-table-column label="结果附件">
      <el-button type="text">
        下载
      </el-button>
      <span class="table-btn">|</span>
      <el-button type="text">
        预览
      </el-button>
    </el-table-column>
    <el-table-column label="状态" />
    <el-table-column label="操作">
      <el-button>完成 </el-button>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>
