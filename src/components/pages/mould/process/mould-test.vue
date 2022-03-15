<template>
  <section class="progress-table">
    <div class="progress-title">
      试模确认进度表
    </div>
    <el-table
      border
      empty-text="无数据"
    >
      <el-table-column label="任务负责人" />
      <el-table-column label="实际完成时间" />
      <el-table-column label="状态" />
      <el-table-column label="操作">
        <el-button>完成</el-button>
        <el-button>不通过</el-button>
        <el-button type="primary">
          通过
        </el-button>
      </el-table-column>
    </el-table>
  </section>
</template>
