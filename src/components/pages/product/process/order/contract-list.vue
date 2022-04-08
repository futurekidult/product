<template>
  <div class="order-title">
    合同确认进度表
  </div>

  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
  >
    <el-table-column label="任务负责人" />
    <el-table-column label="【香港→宁波】的合同确认" />
    <el-table-column label="实际完成时间" />
    <el-table-column label="操作" />
  </el-table>

  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
  >
    <el-table-column label="任务负责人" />
    <el-table-column label="【宁波→工厂】的合同确认" />
    <el-table-column label="实际完成时间" />
    <el-table-column label="产品说明书" />
    <el-table-column label="刀模附件" />
    <el-table-column label="操作" />
  </el-table>
</template>
