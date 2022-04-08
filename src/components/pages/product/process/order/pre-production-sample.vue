<template>
  <div class="order-title">
    大货样确认进度表
  </div>

  <el-table
    border
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
  >
    <el-table-column label="任务负责人" />
    <el-table-column label="计划到货时间" />
    <el-table-column label="大货样套数" />
    <el-table-column label="实际到货时间" />
    <el-table-column label="实际完成时间" />
    <el-table-column label="快递单号" />
    <el-table-column label="状态" />
    <el-table-column label="操作" />
  </el-table>
</template>
