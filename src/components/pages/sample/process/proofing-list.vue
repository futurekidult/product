<template>
  <el-button type="primary">
    提交打样单
  </el-button>

  <el-table>
    <el-table-column label="序号" />
    <el-table-column label="创建人" />
    <el-table-column label="提交时间" />
    <el-table-column label="实际完成时间" />
    <el-table-column label="状态" />
    <el-table-column label="操作">
      <el-button type="text">
        打样单审批
      </el-button>
    </el-table-column>
  </el-table>
</template>
